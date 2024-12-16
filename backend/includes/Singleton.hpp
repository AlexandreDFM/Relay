#pragma once

#include "Server.hpp"

inline std::shared_ptr<Server> getInstanceServer()
{
    static std::shared_ptr<Server> serv = std::make_shared<Server>(8080);

    return serv;
}
