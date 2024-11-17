#include "Server.hpp"

int main() {
    auto server = std::make_shared<Server>(8080);
    return 0;
}
