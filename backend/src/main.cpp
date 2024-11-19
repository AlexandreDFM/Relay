#include "HttpServer.hpp"
#include <boost/asio.hpp>

int main() {
    try {
        boost::asio::io_context ioc;
        const auto address = boost::asio::ip::make_address("0.0.0.0");
        const unsigned short port = 8080;

        HttpServer server(ioc, {address, port});
        std::cout << "Server running on http://0.0.0.0:" << port << std::endl;

        ioc.run();
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
    }
    return 0;
}
