// Import our outputted wasm ES6 module
// Which, export default's, an initialization function
import wasmInit, {
    add_wasm_by_example_to_string,
    count_user_msg
}  from "./wasm/hello_world.js";

export const runWasm = async (x,y) => {
  // Instantiate our wasm module
    const helloWorld = await wasmInit("./wasm/hello_world_bg.wasm");

  // Call the Add function export from wasm, save the result
    const addResult = helloWorld.add(x, y);

    const tsadasd = helloWorld.concat("asd","dsdsdas");//do not do like this

      const helloString = add_wasm_by_example_to_string("Hello from ");

  // Log the result to the console
    console.log(helloString);

  return addResult;
  
};
export const messageCount = async(message) => {
    const initWasm = await wasmInit("./wasm/hello_world_bg.wasm");
    const msgCount = count_user_msg(message);
    return JSON.parse(msgCount);
}
