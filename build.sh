#!/bin/sh

rm -rf target
mkdir target

cp -ar src/* target/
java -jar compiler.jar --js src/js/Trelloviz.js --js src/js/color_picker_knockout_binding.js  --js_output_file target/js/Trelloviz.js
java -jar compiler.jar --js src/js/TrellovizCoreEngine.js --js_output_file target/js/TrellovizCoreEngine.js

java -jar compiler.jar --js src/assets/js/bootstrap-dropdown.js --js_output_file target/assets/js/bootstrap-dropdown.js
java -jar compiler.jar --js src/assets/js/jit.js                --js_output_file target/assets/js/jit.js
java -jar compiler.jar --js src/assets/js/jquery.js             --js_output_file target/assets/js/jquery.js
java -jar compiler.jar --js src/assets/js/knockout.js           --js_output_file target/assets/js/knockout.js
java -jar compiler.jar --js src/assets/js/jquery.colorPicker.js           --js_output_file target/assets/js/jquery.colorPicker.js
