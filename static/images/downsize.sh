for d in */ ; do
    cd $d
    convert ingedients.jpg meal.jpg -quality 50 -set filename:base "%[basename]" "%[filename:base].jpg"
    cd ..
done

