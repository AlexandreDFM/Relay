#include "DataFile.hpp"
#include <iostream>

JsonFile::JsonFile(std::string path)
{
    _path = path;

    try {
        if (!std::filesystem::exists(path)) {
            std::cerr << "File does not exist: " << path << std::endl;
            // Print current working directory
            std::cerr << "Current working directory: " << std::filesystem::current_path() << std::endl;
            return;
        }
        boost::property_tree::read_json(path, _json);
    } catch (const boost::property_tree::json_parser_error& e) {
        std::cerr << "Error reading JSON file at path: " << path
                  << "\nReason: " << e.what() << std::endl;
    }
}

boost::property_tree::ptree& JsonFile::getJson()
{
    return _json;
}

void JsonFile::update_json_file()
{
    try {
        boost::property_tree::write_json(_path, _json);
    } catch (const boost::property_tree::json_parser_error& e) {
        std::cerr << "Error writing JSON file at path: " << _path
                  << "\nReason: " << e.what() << std::endl;
    }
}
