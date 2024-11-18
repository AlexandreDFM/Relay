#pragma once

#include <boost/property_tree/json_parser.hpp>
#include <boost/property_tree/ptree.hpp>
#include <mutex>

class JsonFile {
public:
    JsonFile(std::string path);
    boost::property_tree::ptree& getJson();

    // should always lock the mutex before upadting the json file
    void update_json_file();
    std::mutex _JsonMutex;

private:
    std::string _path;
    boost::property_tree::ptree _json;
};
