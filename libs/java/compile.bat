@echo off
echo Downloading dependencies...

REM Create lib directory
if not exist lib mkdir lib

REM Download OkHttp
curl -L "https://repo1.maven.org/maven2/com/squareup/okhttp3/okhttp/4.12.0/okhttp-4.12.0.jar" -o lib/okhttp-4.12.0.jar

REM Download Kotlin stdlib (required by OkHttp)
curl -L "https://repo1.maven.org/maven2/org/jetbrains/kotlin/kotlin-stdlib/1.9.10/kotlin-stdlib-1.9.10.jar" -o lib/kotlin-stdlib-1.9.10.jar

REM Download Okio (required by OkHttp)
curl -L "https://repo1.maven.org/maven2/com/squareup/okio/okio/3.6.0/okio-3.6.0.jar" -o lib/okio-3.6.0.jar
curl -L "https://repo1.maven.org/maven2/com/squareup/okio/okio-jvm/3.6.0/okio-jvm-3.6.0.jar" -o lib/okio-jvm-3.6.0.jar

REM Download Gson
curl -L "https://repo1.maven.org/maven2/com/google/code/gson/gson/2.10.1/gson-2.10.1.jar" -o lib/gson-2.10.1.jar

echo.
echo Compiling SDK...
C:\jdk\bin\javac -cp "lib/*" -d target/classes src/main/java/com/sedesoft/convertorio/*.java

echo.
echo Creating JAR...
if not exist target mkdir target
cd target/classes
C:\jdk\bin\jar cf ../convertorio-sdk-1.2.0.jar com/sedesoft/convertorio/*.class
cd ../..

echo.
echo Build complete! JAR created at: target/convertorio-sdk-1.2.0.jar
