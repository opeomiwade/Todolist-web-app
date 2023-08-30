
$(".check-box").on("click" , (event) => {
   if($(".check-box").eq(event.currentTarget.id.trim()).prop("checked")){
        $(".task-name").eq(event.currentTarget.id.trim()).addClass("strikethrough");
   }

   else{
    $(".task-name").eq(event.currentTarget.id.trim()).removeClass("strikethrough");
   }
})

