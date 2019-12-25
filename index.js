// Import our outputted wasm ES6 module
// Which, export default's, an initialization function
import wasmInit, {
    add_wasm_by_example_to_string,
    count_user_msg,
    count_words
}  from "./wasm/chat_analyse.js";

export const runWasm = async (x,y) => {
  // Instantiate our wasm module
    const helloWorld = await wasmInit("./wasm/chat_analyse_bg.wasm");

  // Call the Add function export from wasm, save the result
    const addResult = helloWorld.add(x, y);

    const tsadasd = helloWorld.concat("asd","dsdsdas");//do not do like this

      const helloString = add_wasm_by_example_to_string("Hello from ");

  // Log the result to the console
    console.log(helloString);
    console.log(count_words(" asd dasd  asdash as gdas ghdashjds d s  d d d d d d d"));

  return addResult;
  
};
export const messageCount = async(message) => {
    const initWasm = await wasmInit("./wasm/chat_analyse_bg.wasm");
    const msgCount = count_user_msg(message);
    return JSON.parse(msgCount);
}

export const wordCount = async(message) => {
    const initWasm = await wasmInit("./wasm/chat_analyse_bg.wasm");
    const pronoun_list = "i,me,my,myself,we,our,ours,ourselves,you,your,yours,yourself,yourselves,he,him,his,himself,she,her,hers,herself,it,its,itself,they,them,their,theirs,themselves,what,which,who,whom,this,that,these,those,am,is,are,was,were,be,been,being,have,has,had,having,do,does,did,doing,a,an,the,and,but,if,or,because,as,until,while,of,at,by,for,with,about,against,between,into,through,during,before,after,above,below,to,from,up,down,in,out,on,off,over,under,again,further,then,once,here,there,when,where,why,how,all,any,both,each,few,more,most,other,some,such,no,nor,not,only,own,same,so,than,too,very,s,t,can,will,just,don,should,now";
;
    const msgCount = count_words(message,pronoun_list);
    console.log(msgCount);
    return JSON.parse(msgCount);
}
