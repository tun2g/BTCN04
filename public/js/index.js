$(() => {
    $("#btn-register").on("click", (e) => {
        e.preventDefault();
        const name = $("#name").val();
        const username = $("#username").val();
        const address = $("#address").val();
        const password = $("#password").val();

        const user = {
            name,
            username,
            address,
            password,
        };
        if (name !== "" && username !== "" && address !== "" && password !== "") {
            $.ajax({
                url: "http://localhost:3113/auth/register",
                type: "POST",
                data: user,
            }).done((data) => {
                if (data.result === "redirect") {
                    window.location.replace(data.url);
                }
            });
        } else {
            alert("error!");
        }
    });

    $('#btn-login').on('click', (e) => {
        e.preventDefault();
        const username = $("#username").val();
        const password = $("#password").val();
        const time=$("#time").val();
        const user = {
            username,
            password,
            time
        }
        console.log(user)
        if (username !== "" && password !== "") {
            $.ajax({
                url: "http://localhost:3113/auth/login",
                type: "POST",
                data: user,
            }).done((data) => {
                if (data.result === "redirect") {
                    window.location.replace(data.url);
                }
            });
        } else {
            alert("error!");
        }

    })

    $('#logout').on('click',(e)=>{
        window.location.replace('http://localhost:20617/');
        alert("Đăng xuất thành công")
    })

    $('.add-btn').on('click',(e)=>{

        const card=e.target.parentNode
        const id=card.getElementsByClassName("id")[0].textContent
        $.ajax({
            url: `http://localhost:20617/shop/add/${id}`,
            type: "POST",
            data: {id:id},
        })
    })


});
