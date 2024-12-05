#pragma once

#include <mutex>
#include <filesystem>
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/json_parser.hpp>

class JsonFile {
public:
    JsonFile(std::string path);
    boost::property_tree::ptree& getJson();

    // should always lock the mutex before upadting the json file
    void update_json_file();

    std::string _path;
    std::mutex _JsonMutex;

    private:
        boost::property_tree::ptree _json;
};
