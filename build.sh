## TODO migrate to gulp probably

# clear and re-create the out directory
rm -rf out || exit 0;
mkdir out;

rm -f index.html
rm -rf styles/*.css

npm run build-in-place

cp index.html out/

mkdir out/styles/
cp styles/*.css out/styles/

cp -r refs images homework fonts scripts docs out/

echo ""
find out/ -print
echo ""
