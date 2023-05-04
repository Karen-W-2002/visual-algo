# CPP SERVER

## Example 
```cpp
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
```