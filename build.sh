# clear and re-create the out directory
rm -rf out || exit 0;
mkdir out;

cp index.html out/
cp script.js out/

npm run stylus
mkdir out/styles/
cp styles/*.css out/styles/

cp -r refs images homework fonts out/
