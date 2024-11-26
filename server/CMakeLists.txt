cmake_minimum_required(VERSION 3.14)

# Set the project name and version
project(relay_socket_server VERSION 1.0)

# Specify the C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Add the include directory for header files
include_directories(${CMAKE_SOURCE_DIR}/includes)

# Attempt to find the Boost library
find_package(Boost COMPONENTS iostreams system json beast property_tree)

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
    set(CPM_SOURCE_CACHE ${CMAKE_CURRENT_SOURCE_DIR}/CPM_PACKAGE_CACHE CACHE STRING "Location of CPM packages")

    # Specify Boost version and download using CPM
    set(BOOST_VERSION 1.84.0)

    CPMAddPackage(
            NAME Boost
            VERSION ${BOOST_VERSION}
            GITHUB_REPOSITORY "boostorg/boost"
            GIT_TAG "boost-${BOOST_VERSION}"
            OPTIONS "BOOST_ENABLE_CMAKE ON" "BOOST_INCLUDE_LIBRARIES asio\\\;iostreams\\\;system\\\;json\\\;beast\\\;property_tree"
    )

    if (Boost_ADDED)
        message(STATUS "Boost downloaded and configured via CPM: ${Boost_INCLUDE_DIRS}")
    else()
        message(FATAL_ERROR "Failed to download Boost using CPM.")
    endif()
else()
    # If Boost is found, include directories and libraries
    message(STATUS "Boost found: ${Boost_INCLUDE_DIRS}")
endif()

# Add the Boost include directories
#include_directories(${Boost_INCLUDE_DIRS})

# Add the executable from the source files in the src directory
file(GLOB_RECURSE SOURCES
        ${CMAKE_SOURCE_DIR}/src/*.cpp
        ${CMAKE_SOURCE_DIR}/includes/*.h
        ${CMAKE_SOURCE_DIR}/includes/*.hpp
)

# Create the executable
add_executable(${PROJECT_NAME} ${SOURCES})

# Add Boost include directories and libraries after the target is created
if (WIN32)
    target_link_libraries(${PROJECT_NAME} PRIVATE Boost::asio Boost::iostreams Boost::property_tree Boost::system Boost::json Boost::beast ws2_32 Mswsock pthread)
else()
    target_link_libraries(${PROJECT_NAME} PRIVATE Boost::asio Boost::iostreams Boost::property_tree Boost::system Boost::json Boost::beast pthread)
endif()

install(TARGETS ${PROJECT_NAME} DESTINATION bin)
