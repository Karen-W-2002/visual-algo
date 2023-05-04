#include <iostream>
#include "include/crow.h"
#include "include/rapidjson/document.h"
#include "include/rapidjson/stringbuffer.h"
#include "include/rapidjson/writer.h"

void selectionSort(rapidjson::Document &recv_doc, crow::websocket::connection &conn, rapidjson::Value &arr);

int main()
{
  crow::SimpleApp app;

  CROW_WEBSOCKET_ROUTE(app, "/ws")
      .onopen([&](crow::websocket::connection &conn)
              { conn.send_text("Websocket server on!"); })
      .onclose([&](crow::websocket::connection &conn, const std::string &reason)
               { conn.send_text("Websocket server closed!"); })
      .onmessage([&](crow::websocket::connection &conn, const std::string &message, bool is_binary)
                 {
                   std::cout << "Message recieved: " << std::endl << message << std::endl;

                   // Parse the json file recieved from the frontend
                   rapidjson::Document recv_doc;
                   recv_doc.Parse(message.c_str());

                   // Get the array
                   // Using a reference for consecutive access is handy and faster.
                   rapidjson::Value &arr = recv_doc;
                   assert(arr.IsObject());

                   selectionSort(recv_doc, conn, arr);

                   rapidjson::Document doc;
                   doc.SetObject();
                   doc.AddMember("finished", "true", doc.GetAllocator());

                   rapidjson::StringBuffer buffer;
                   rapidjson::Writer<rapidjson::StringBuffer> writer(buffer);
                   doc.Accept(writer);
                   std::string json_str = buffer.GetString();
                   conn.send_text(json_str); });

  app.port(18080).run();

  return 0;
}

void selectionSort(rapidjson::Document &recv_doc, crow::websocket::connection &conn, rapidjson::Value &arr)
{
  for (rapidjson::SizeType i = 0; i < arr["num"].Size(); i++) // Uses SizeType instead of size_t
  {
    rapidjson::SizeType min = i;

    arr["index_i"][i] = true;
    arr["min"][i] = true;

    for (rapidjson::SizeType j = i + 1; j < arr["num"].Size(); j++)
    {
      if (arr["num"][j].GetInt() < arr["num"][min].GetInt())
      {
        arr["min"][min] = false;
        min = j;
        arr["min"][min] = true;
      }

      // Convert the JSON document to a string
      rapidjson::StringBuffer buffer;
      rapidjson::Writer<rapidjson::StringBuffer> writer(buffer);
      recv_doc.Accept(writer);
      std::string json_str = buffer.GetString();
      conn.send_text(json_str);
    }
    // Swap the found minimum element
    // with the first element
    if (min != i)
    {
      arr["num"][i].Swap(arr["num"][min]);
    }

    arr["index_i"][i] = false;
    arr["min"][min] = false;

    // Convert the JSON document to a string
    rapidjson::StringBuffer buffer;
    rapidjson::Writer<rapidjson::StringBuffer> writer(buffer);
    recv_doc.Accept(writer);
    std::string json_str = buffer.GetString();
    conn.send_text(json_str);
  }
}