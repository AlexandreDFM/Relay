cmake_minimum_required(VERSION 3.10)

# Set the project name and version
project(relay_server VERSION 1.0)

# Specify the C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Add the include directory for header files
include_directories(${CMAKE_SOURCE_DIR}/includes)

# Attempt to find the Boost library
find_package(Boost COMPONENTS iostreams system json beast)

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
            OPTIONS "BOOST_ENABLE_CMAKE ON" "BOOST_INCLUDE_LIBRARIES asio\\\;iostreams\\\;system\\\;json\\\;beast"
    )

    if (Boost_Backend_ADDED)
        message(STATUS "Boost downloaded and configured via CPM: ${Boost_INCLUDE_DIRS}")
    else()
        message(STATUS "Failed to download Boost using CPM. Maybe it was already found.")
    endif()
else()
    # If Boost is found, include directories and libraries
    message(STATUS "Boost found: ${Boost_INCLUDE_DIRS}")
endif()


# Add the executable from the source files in the src directory
file(GLOB_RECURSE SOURCES
        ./src/*.cpp
        ./includes/*.h
        ./includes/*.hpp
)

# Include directories
include_directories(./includes)

message(STATUS "Boost Include Directories: ${Boost_INCLUDE_DIRS}")
message(STATUS "Boost Libraries: ${Boost_LIBRARIES}")
message(STATUS "CMake Binary Dir: ${CMAKE_BINARY_DIR}")

# Include the Boost include directories
include_directories(${CMAKE_BINARY_DIR}/_cpm/Boost/include)

# Print the sources
message(STATUS "Sources: ${SOURCES}")

# Create the executable
add_executable(${PROJECT_NAME} ${SOURCES})

# Add Boost include directories and libraries after the target is created
if (Boost_FOUND OR Boost_ADDED)
    if (WIN32)
        # Add symlink to ./Database in the build directory
        message(STATUS "Source directory for symlink: ${CMAKE_SOURCE_DIR}/server/Database")
        message(STATUS "Target directory for symlink: $<TARGET_FILE_DIR:${PROJECT_NAME}>/../Database")

        add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
            COMMAND ${CMAKE_COMMAND} -E copy_directory
            ${CMAKE_SOURCE_DIR}/server/Database
            $<TARGET_FILE_DIR:${PROJECT_NAME}>/../Database
        )

        target_link_libraries(${PROJECT_NAME} Boost::asio Boost::iostreams Boost::system Boost::json Boost::beast ws2_32 Mswsock)
    else()
        target_link_libraries(${PROJECT_NAME} Boost::asio Boost::iostreams Boost::system Boost::json Boost::beast pthread)
    endif()
endif()

install(TARGETS ${PROJECT_NAME} DESTINATION bin)
