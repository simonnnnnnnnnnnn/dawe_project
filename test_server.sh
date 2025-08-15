#!/bin/bash

echo "create a platform"
curl -X POST http://localhost:8282/platform -H "Content-Type: application/json" -d '{"platform_ID": "GPL777", "title": "server test", "organism": "Homo studentus", "technology": "VSCode", "created_at": "2025-03-05", "updated_at": "2025-07-07"}'
echo -e "\n"

echo "get the created platform"
curl http://localhost:8282/platform/GPL777
echo -e "\n"

echo "update GPL777"
curl -X PUT http://localhost:8282/platform/GPL777 -H "Content-Type: application/json" -d '{"platform_ID": "GPL777", "title": "server test", "organism": "Homo studentus", "technology": "bash", "created_at": "2025-03-05", "updated_at": "2025-07-08"}'
echo -e "\n"

echo "get all platforms"
curl http://localhost:8282/platforms
echo -e "\n"

echo "delete GPL777"
curl -X DELETE http://localhost:8282/platform/GPL777
echo -e "\n"

echo "crud test done"
echo "starting method tests"

echo "get array for a platform"
curl http://localhost:8282/platform/GPL400/platform_array
echo -e "\n"

# problem here
echo "get samples from a platform"
curl http://localhost:8282/platform/GPL400/samples
echo -e "\n"

echo "get all platforms for a sample"
curl http://localhost:8282/samples/GSM5001/platform
echo -e "\n"

# problem here
echo "get the expression levels for a sample"
curl http://localhost:8282/samples/GSM5001/expression
echo -e "\n"

echo "get the series of which the sample is a part of"
curl http://localhost:8282/samples/GSM5001/series
echo -e "\n"

echo "get everything about a sample --> experimental methof"
curl http://localhost:8282/samples/GSM5001/full
echo -e "\n"

echo "get all samples of a series"
curl http://localhost:8282/series/GSE1001/samples
echo -e "\n"