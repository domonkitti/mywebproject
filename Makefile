dev :
	npm run dev

test :
	npm run test
	npm run build

pull :
	git fetch
	git pull

e2e :
	npm run test:e2e -- --ui 