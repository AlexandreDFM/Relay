cmake_minimum_required(VERSION 3.14)

# Set the project name and version
project(relay_socket_server VERSION 1.0)

# Specify the C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Add the include directory for header files
include_directories(${CMAKE_SOURCE_DIR}/includes)

# Attempt to find the Boost library
find_package(Boost COMPONENTS iostreams system thread json beast property_tree)

if (NOT Boost_FOUND)
    message(STATUS "Boost not found. Falling back to CPM for downloading Boost.")

    # Include CPM (CMake Package Manager)
    if (NOT EXISTS "${CMAKE_BINARY_DIR}/_cpm/CPM.cmake")
        file(DOWNLOAD
                https://github.com/cpm-cmake/CPM.cmake/releases/latest/download/CPM.cmake
                ${CMAKE_BINARY_DIR}/_cpm/CPM.cmake
        )
    endif()

    # Include the CPM.cmake file
    include(${CMAKE_BINARY_DIR}/_cpm/CPM.cmake)

    # Set the location of the CPM package cache
    set(CPM_SOURCE_CACHE ${CMAKE_BINARY_DIR}/CPM_PACKAGE_CACHE CACHE STRING "Location of CPM packages")

    # Specify Boost version and download using CPM
    set(BOOST_VERSION 1.84.0)

    CPMAddPackage(
            NAME Boost
            VERSION ${BOOST_VERSION}
            GITHUB_REPOSITORY "boostorg/boost"
            GIT_TAG "boost-${BOOST_VERSION}"
            OPTIONS "BOOST_ENABLE_CMAKE ON" "BOOST_INCLUDE_LIBRARIES asio\\\;iostreams\\\;system\\\;thread\\\;json\\\;beast\\\;property_tree"
    )

    if (Boost_ADDED)
        message(STATUS "Boost downloaded and configured via CPM: ${Boost_INCLUDE_DIRS}")
    else()
        message(FATAL_ERROR "Failed to download Boost using CPM. Maybe it was already found.")
    endif()
else()
    # If Boost is found, include directories and libraries
    message(STATUS "Boost found: ${Boost_INCLUDE_DIRS}")
endif()

# Add the Boost include directories
#include_directories(${Boost_INCLUDE_DIRS})

file(GLOB_RECURSE SOURCES
    ./src/*.cpp
    ./includes/*.h
    ./includes/*.hpp
)

# Include directories
include_directories(./includes)

# Print the sources
message(STATUS "Sources: ${SOURCES}")

# Create the executable
add_executable(${PROJECT_NAME} ${SOURCES})

# Add symlink to ./Database in the build directory
message(STATUS "Source directory for symlink: ${CMAKE_SOURCE_DIR}/server/Database")
message(STATUS "Target directory for symlink: $<TARGET_FILE_DIR:${PROJECT_NAME}>/../Database")

# Add a post-build command to copy the Database directory to the build directory
# Try to use a symlink if possible, otherwise copy the directory

# Check if the path does not exist
if (NOT EXISTS ${CMAKE_SOURCE_DIR}/server/Database)
    message(STATUS "Database directory not found. Please create the Database directory in the server directory.")
    # Check if the directive is a directory
    elseif (NOT IS_DIRECTORY ${CMAKE_SOURCE_DIR}/server/Database)
        if (WIN32)
            add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
                    COMMAND ${CMAKE_COMMAND} -E copy_directory
                    ${CMAKE_SOURCE_DIR}/server/Database
                    $<TARGET_FILE_DIR:${PROJECT_NAME}>/../Database
            )
        else()
            add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
                    COMMAND ${CMAKE_COMMAND} -E create_symlink
                    ${CMAKE_SOURCE_DIR}/server/Database
                    $<TARGET_FILE_DIR:${PROJECT_NAME}>/../Database
        )
    endif()
endif()

# Add Boost include directories and libraries after the target is created
if (WIN32)
    target_link_libraries(${PROJECT_NAME} PRIVATE Boost::asio Boost::iostreams Boost::property_tree Boost::system Boost::thread Boost::json Boost::beast ws2_32 Mswsock)
else()
    target_link_libraries(${PROJECT_NAME} PRIVATE Boost::asio Boost::iostreams Boost::property_tree Boost::system Boost::thread Boost::json Boost::beast pthread)
endif()

install(TARGETS ${PROJECT_NAME} DESTINATION bin)
