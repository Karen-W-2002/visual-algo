#include <iostream>
#include "include/crow.h"
#include "include/rapidjson/document.h"
#include "include/rapidjson/stringbuffer.h"
#include "include/rapidjson/writer.h"

int main()
{
  crow::SimpleApp app;

  std::vector<int> numbers = {1, 2, 3, 4, 5};
  // Create a JSON document and serialize the array into it
  rapidjson::Document doc;
  doc.SetArray();
  for (auto num : numbers)
  {
    rapidjson::Value val;
    val.SetInt(num);
    doc.PushBack(val, doc.GetAllocator());
  }

  // Convert the JSON document to a string
  rapidjson::StringBuffer buffer;
  rapidjson::Writer<rapidjson::StringBuffer> writer(buffer);
  doc.Accept(writer);
  std::string json_str = buffer.GetString();

  CROW_WEBSOCKET_ROUTE(app, "/ws")
      .onopen([&](crow::websocket::connection &conn)
              {
                // conn.send_text(json_str);
                // conn.send_text("My websocket server!");
              })
      .onclose([&](crow::websocket::connection &conn, const std::string &reason)
               { conn.send_text("Websocket server closed!"); })
      .onmessage([&](crow::websocket::connection &conn, const std::string &message, bool is_binary)
                 {
                   // conn.send_text("You said: " + message);
                   std::cout << "message rec: " << std::endl
                             << message << std::endl;

                   // Parse the json file
                   rapidjson::Document recv_doc;
                   recv_doc.Parse(message.c_str());

                   // Get the array
                   rapidjson::Value &a = recv_doc["num"];
                   assert(a.IsArray());

                   for (rapidjson::SizeType i = 0; i < a.Size(); i++) // Uses SizeType instead of size_t
                   {
                     rapidjson::SizeType min = i;
                     // printf("a[%d] = %d\n", i, a[i].GetInt());
                     for (rapidjson::SizeType j = i + 1; j < a.Size(); j++)
                     {
                       if (a[j].GetInt() < a[min].GetInt())
                         min = j;
                     }
                     // Swap the found minimum element
                     // with the first element
                     if (min != i)
                     {
                       a[i].Swap(a[min]);
                     }
                   }

                   // for (rapidjson::SizeType i = 0; i < a.Size(); i++)
                   //   printf("a[%d] = %d\n", i, a[i].GetInt());

                   // Convert the JSON document to a string
                   rapidjson::StringBuffer buffer;
                   rapidjson::Writer<rapidjson::StringBuffer> writer(buffer);
                   recv_doc["num"].Accept(writer);
                   std::string json_str = buffer.GetString();
                   conn.send_text(json_str); });

  app.port(18080).run();

  return 0;
}