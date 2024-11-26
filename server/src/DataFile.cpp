#include "DataFile.hpp"
#include <iostream>

JsonFile::JsonFile(std::string path)
{
    _path = path;

    try {
        // Read the JSON file into the property tree
        boost::property_tree::read_json(path, _json);

    } catch (const boost::property_tree::json_parser::json_parser_error& e) {
        std::cerr << "Error reading JSON file: " << e.what() << std::endl;
    }
}

boost::property_tree::ptree& JsonFile::getJson()
{
    return _json;
}

void JsonFile::update_json_file()
{
    boost::property_tree::write_json(_path, _json);
}
