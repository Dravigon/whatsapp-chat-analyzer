build:
	wasm-pack build --target web --out-dir wasm
	rm -rf ../wasm
	mkdir ../wasm
	cp wasm/*.js ../wasm/
	cp wasm/*.wasm ../wasm/
