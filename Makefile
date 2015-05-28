install:
	npm install && ./node_modules/.bin/bower install --config.interactive=false

clean:
	rm -rf node_modules
	rm -rf bower_components
	rm -rf public/*

live:
	./node_modules/.bin/grunt live --force

build:
	./node_modules/.bin/grunt build

package:
	rm -rf public/*
	./node_modules/.bin/grunt package

deploy:
	cd public/; \
		git init .; \
		git checkout -b gh-pages; \
		git add .; \
		git remote add origin git@github.com:clindsey/prismr.git; \
		git commit -am 'deploying'; \
		git push origin gh-pages --force

version:
	./node_modules/.bin/grunt replace --semver=${SEMVER}

scaleSprites:
	cd app/assets/images/; \
		convert prismr-1x.png -interpolate Nearest -filter point -resize 200% prismr-2x.png; \
		convert prismr-1x.png -interpolate Nearest -filter point -resize 300% prismr-3x.png;
