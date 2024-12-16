#pragma once

#include "Server.hpp"

inline std::shared_ptr<Server> getInstanceServer()
{
    static std::shared_ptr<Server> serv = std::make_shared<Server>("127.0.0.1", "8080");

    return serv;
}
