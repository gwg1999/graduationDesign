export const stopF5F6=()=>{
  window.addEventListener("keydown", function(e) {
    if(e.key==='F5'||e.key==='F6'){
      e.preventDefault();
    }
  }, false);
}
