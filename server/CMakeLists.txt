cmake_minimum_required(VERSION 3.10)

# Set the project name and version
project(server VERSION 1.0)

# Specify the C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Add the include directory for header files
include_directories(${CMAKE_SOURCE_DIR}/includes)

# Find the Boost library (requires Boost to be installed)
find_package(Boost REQUIRED COMPONENTS iostreams)

if (Boost_FOUND)
    include_directories(${Boost_INCLUDE_DIRS})
    message(STATUS "Boost found: ${Boost_INCLUDE_DIRS}")
else()
    message(FATAL_ERROR "Boost not found. Please install Boost.")
endif()

# Add the executable or library from the source files in the src directory
file(GLOB_RECURSE SOURCES ${CMAKE_SOURCE_DIR}/src/*.cpp)
add_executable(${PROJECT_NAME} ${SOURCES})

# Link Boost libraries
target_link_libraries(${PROJECT_NAME} Boost::iostreams pthread)
