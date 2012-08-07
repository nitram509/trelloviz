#!/bin/sh

rm -rf target
mkdir target

cp -ar src/* target/
java -jar compiler.jar --js src/js/Trelloviz.js --js_output_file target/js/Trelloviz.js
java -jar compiler.jar --js src/js/TrellovizData.js --js_output_file target/js/TrellovizData.js

java -jar compiler.jar --js src/assets/js/bootstrap-dropdown.js --js_output_file target/assets/js/bootstrap-dropdown.js
java -jar compiler.jar --js src/assets/js/jit.js --js_output_file target/assets/js/jit.js
java -jar compiler.jar --js src/assets/js/jquery.js --js_output_file target/assets/js/jquery.js
