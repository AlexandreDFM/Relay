#include "Singleton.hpp"

int main()
{
    std::shared_ptr<Server> serv = getInstanceServer();
    serv->start();

    return 0;
}
