//const list_items = {};

$.ajax({
    url: "https://localhost:44306/API/Course/GetCourse",
}).done((result) => {
    console.log(result);
	let text = "";
	//let list_items = val.name;
    $.each(result, function (key, val) {
		console.log(val.name);
        text += `

            <div class="card">
            <!-- Card header -->
            <div class="card-header">
              <div class="row align-items-center">
                <div class="col-8">
                  <!-- Title -->
                  <h5 class="h3 mb-0">${val.name}</h5>
                </div>
                <div class="col-4 text-right">
                  
                  <a href="#!" class="btn btn-sm btn-neutral">${val.topic}</a>
                </div>
              </div>
            </div>
            <!-- Card image -->
            <!-- List group -->
            <!-- Card body -->
            <div class="card-body">
              <span class="h3 mb-0">Rp.${val.price}</span>
              <p class="card-text mb-4">${val.description}</p>
              
              <a href="#" onClick="detailBuyCourse('${val.courseId}')" class="btn btn-primary" data-toggle="modal" data-target="#modalsBuyCourse">Buy Course</a>
            </div>
          </div>`
    });
    //console.log(text);
    $("#card2").html(text);

	
}).fail((error) => {
    console.log(error);
})



function detailBuyCourse(data) {
    $.ajax({
        url: "https://localhost:44306/API/Course/" + data
    }).done((item) => {
        /*let item = e.find(item => item.courseId === data)*/
        $("#UcourseId").attr("value", item.courseId);
        $("#UnameCourse").html(item.name);
        $("#UDescCourse").html(item.description);
        $("#CoursePrice").html("Rp."+item.price);
        $.ajax({
            url: "https://localhost:44306/API/Section",
        }).done((section) => {
            let tmp1 = "";

            itemSection = section.filter(g => g.courseId == item.courseId);
            console.log(itemSection)

          
            $.each(itemSection, function (key, val) {
                tmp1 += `<a href = "#" class="list-group-item list-group-item-action flex-column align-items-start"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1">${val.name}</h5></div><p class="mb-1">${val.description}</p></a >`;
            })
            console.log(tmp1);
            $("#SectionGrup").html(tmp1);
            
        })






        $.ajax({
            url: "https://localhost:44306/API/Topic",
        }).done((result) => {

            let itemTopic = result.find(e => e.topicId === item.topicId);
            console.log(itemTopic);

            $(".topics").val(itemTopic.topicId);
        })







       /* $("#UnameCourse").attr("value", item.name);
        $("#Udescription").val(item.description);
        $("#Uprice").attr("value", item.price);
        console.log(item);
*/

     /*   
        $('#DataTable_SectionTransaction').DataTable({
            "bDestroy": true,
            language: {
                paginate: {
                    next: '<i class="fas fa-angle-right">',
                    previous: '<i class="fas fa-angle-left">'
                }
            },
            "ajax": {
                "url": "https://localhost:44306/API/Section",
                "dataType": "json",
                "dataSrc": function (json) {
                    return json.filter(function (section) {
                        return section.courseId == item.courseId;
                    });
                },
            },
            "columns": [
                {
                    "data": null, "sortable": false,
                    render: function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                {
                    "data": "name"
                },
            ]

        });*/



       
    })
}


function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#falseinput').attr('src', e.target.result);
            $('#base').val(/base64,(.+)/.exec(e.target.result)[1]);
        };
        reader.readAsDataURL(input.files[0]);
    }
}




function AddTransaction() {
    var obj = new Object();
    obj.userId = parseInt($("#UuserId").val());
    obj.courseId = parseInt($("#UcourseId").val());
    obj.status = 2;
    var tgl = new Date().toLocaleString();
    obj.date = moment(tgl).format();
    obj.bukti_pembayaran = $("#base").val();
    console.log(obj);

    if (obj.bukti_pembayaran == "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to make payment !',
        })
    } else {
        $.ajax({
            url: ("https://localhost:44306/API/Transaction"),
        }).done((result) => {
            let item = result.find(item => item.courseId === parseInt($("#UcourseId").val()) && item.userId === parseInt($("#UuserId").val()));
            //console.log(item)
            
            if (item == null) {


                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger'
                    },
                    buttonsStyling: false
                })

                swalWithBootstrapButtons.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, Buy it!',
                    cancelButtonText: 'No, cancel!',
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        $.ajax({
                            url: ("https://localhost:44306/API/Transaction"),
                            type: "POST",
                            contentType: "application/json",
                            data: JSON.stringify(obj)
                        }).done((result) => {
                           
                            $("#modalsBuyCourse").modal('hide');
                            Swal.fire({
                                icon: 'success',
                                title: 'Proof of payment has been uploaded successfully',
                            })
                            document.getElementById("base").attr("val", "");
                        }).fail((error) => {
                            console.log(error)
                        })
                    } else if (

                        result.dismiss === Swal.DismissReason.cancel
                    ) {
                        swalWithBootstrapButtons.fire(
                            'Cancelled',
                            'Your imaginary file is safe :)',
                            'error'
                        )
                    }
                })
            } else {
                
                if (item.status == 1) {
                    $.ajax({
                        url: ("https://localhost:44306/API/Transaction"),
                        type: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(obj)
                    }).done((result) => {

                        $("#modalsBuyCourse").modal('hide');
                        Swal.fire({
                            icon: 'success',
                            title: 'Proof of payment has been uploaded successfully',
                        })
                        document.getElementById("base").attr("val", "");
                    }).fail((error) => {
                        console.log(error)
                    })

                } else {

                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Course already purchased',
                    })
                    document.getElementById("form_AddTransaction").reset();
                    $("#modalsBuyCourse").modal('hide');
                }

                
               
            }

        }).fail((error) => {
            console.log(error)
        })

    }


}


//Insert
/*$("#form_AddTransaction").submit(function (e) {
    e.preventDefault();
    var obj = new Object(); 
    obj.userId = parseInt($("#UuserId").val());
    obj.courseId = parseInt($("#UcourseId").val());
    obj.status = 2;
    var tgl = new Date().toLocaleString();
    obj.date = moment(tgl).format();


    obj.bukti_pembayaran = $("#base").val();
    console.log(obj);

    if (obj.bukti_pembayaran == "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to make payment !',
        })
    } else {
        $.ajax({
            url: ("https://localhost:44306/API/Transaction"),
            //type: "POST",
            //contentType: "application/json",
            //data: JSON.stringify(obj) //jika terkena 415 unsupported media type (tambahkan headertype Json & JSON.Stringify(obj);)
        }).done((result) => {
            let item = result.find(item => item.courseId === parseInt($("#UcourseId").val()) && item.userId === parseInt($("#UuserId").val()));
            //console.log(item)

            if (item == null) {
                

                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger'
                    },
                    buttonsStyling: false
                })

                swalWithBootstrapButtons.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, delete it!',
                    cancelButtonText: 'No, cancel!',
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        $.ajax({
                            url: ("https://localhost:44306/API/Transaction"),
                            type: "POST",
                            contentType: "application/json",
                            data: JSON.stringify(obj) 
                        }).done((result) => {
                            document.getElementById("form_AddTransaction").reset();
                            $("#modalsBuyCourse").modal('hide');
                            Swal.fire({
                                icon: 'success',
                                title: 'Proof of payment has been uploaded successfully',
                            })
                            $("#form_addTransaction").attr("class", "needs-validation");
                        }).fail((error) => {
                            console.log(error)
                        })
                    } else if (
                    
                        result.dismiss === Swal.DismissReason.cancel
                    ) {
                        swalWithBootstrapButtons.fire(
                            'Cancelled',
                            'Your imaginary file is safe :)',
                            'error'
                        )
                    }
                })
            } else {
                console.log(item)
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Course already purchased',
                })
                document.getElementById("form_AddTransaction").reset();
                $("#modalsBuyCourse").modal('hide');
            }
            
        }).fail((error) => {
            console.log(error)
        })
      
    }
})
*/

/*FILTER DI LANDINGPAGE*/
$.ajax({
    url: "https://localhost:44306/API/Topic",
    context: document.body
}).done((result) => {
    console.log(result);
    let text = "";


    $.each(result, function (key, val) {
        var namatopic = val.name;
        var change = namatopic.replace(/\s/g, '');
        text += `<li><a href="#" data-filter=".${change}" id="${change}" >${val.name}</a></li>`;

    });
    console.log(text);
    var gabung = `<li class="activeFilter"><a href="#" data-filter="*">Show All</a></li>` + text
    $("#menuIndra").html(gabung);

}).fail((error) => {
    console.log(error);
});


$.ajax({
    url: "https://localhost:44306/API/Course/GetCourse",
    context: document.body
}).done((ress) => {

    let articleall = "";
    $.each(ress, function (key, val) {

        var namatopic2 = val.topic;
        var change2 = namatopic2.replace(/\s/g, '');

        console.log(change2)

        articleall += `<article class="portfolio-item pf-uielements ${change2}" >
                        <div class="portfolio-image">
                            <a href="portfolio-single.html">
                                <div backgroundColor="red"></div>
                            </a>
                        </div>
                        <div class="portfolio-desc">
                            <h3>${val.name}</h3>
                            <span>${val.topic}</span>
                        </div>
                    </article>`;
    })

    $("#portfolio").html(articleall);
});

/*Data Total Transaction*/
$.ajax({
    url: "https://localhost:44306/API/Transaction/GetTransaction"
}).done((item) => {
    $("#totalTransactions").attr("data-to", item.length);
    console.log(item.length);
})

/*Data Total Topics*/
$.ajax({
    url: "https://localhost:44306/API/Topic"
}).done((item) => {
    $("#totalTopics").attr("data-to", item.length);
    console.log(item.length);
})

/*Data Total Courses*/
$.ajax({
    url: "https://localhost:44306/API/Course"
}).done((item) => {
    $("#totalCourses").attr("data-to", item.length);
    console.log(item.length);
})

/*Data Total Users*/
$.ajax({
    url: "https://localhost:44306/API/User"
}).done((item) => {
    $("#totalUsers").attr("data-to", item.length);
    console.log(item.length);
})


//Profile
$(document).ready(function () {

    var data2 = document.getElementById("UserId").value;
    console.log(data2);


    //get data customer
    $.ajax({
        url: "https://localhost:44306/API/User/" + data2

    }).done((res) => {

        console.log(res);

        $("#myUserId").attr("value", res.userId);
        $("#myFirstName").attr("value", res.firstName);
        $("#myLastName").attr("value", res.lastName);
        //$("#BirthDate2").attr("value", res.birthdate);
        document.getElementById("myBirthDate").value = moment(res.birthdate).format("yyyy-MM-DD");
        if (res.gender === 0) {
            //$("#male").attr("selected", "selected");
            $("#myGender").val(0);
        }
        if (res.gender === 1) {
            //$("#female").attr("selected", "selected");
            $("#myGender").val(1);
        }
        $("#myPhone").attr("value", res.phone);
        $("#myEmail").attr("value", res.email);
    })

})

//change data customer
$('#formMyProfile').submit(function (e) {
    e.preventDefault();

    let obj = new Object(); //sesuaikan sendiri nama objectnya dan beserta isinya
    //ini ngambil value dari tiap inputan di form nya
    obj.UserId = parseInt($("#myUserId").val());
    obj.firstName = $("#myFirstName").val();
    obj.lastName = $("#myLastName").val();
    obj.Birthdate = $("#myBirthdate").val();
    obj.Gender = parseInt($("#myGender").val());
    obj.Phone = $("#myPhone").val();
    obj.Email = $("#myEmail").val();


    console.log(obj);
    $.ajax({
        url: "https://localhost:44306/API/User"
    }).done((res1) => {



        let item1 = res1.find(a => a.userId == obj.UserId)
        console.log(item1);
        if (item1.email === obj.Email && item1.phone === obj.Phone) {

            $.ajax({
                url: "https://localhost:44306/API/User",
                type: "PUT",
                contentType: 'application/json',
                data: JSON.stringify(obj), //jika terkena 415 unsupported media type (tambahkan headertype Json & JSON.Stringify();)
            }).done((result) => {
                //buat alert pemberitahuan jika success

                $('#updateData').modal('hide');
                console.log(result);
                $('#DataTable_User').DataTable().ajax.reload();
                Swal.fire({
                    icon: 'success',
                    title: 'Data has been updated',
                })

            }).fail((error) => {

                console.log(error)
            })
        } else {
            $.ajax({
                url: "https://localhost:44306/API/User"
            }).done((res2) => {

                let item2 = res2.filter(a => a.email == obj.Email)
                console.log(item2)
                let item3 = item2.filter(f => f.phone == obj.phone)
                console.log(item3)


                if (item3.length == 0 && item2.length == 0) {
                    $.ajax({
                        url: "https://localhost:44306/API/User",
                        type: "PUT",
                        contentType: 'application/json',
                        data: JSON.stringify(obj), //jika terkena 415 unsupported media type (tambahkan headertype Json & JSON.Stringify();)
                    }).done((result) => {
                        //buat alert pemberitahuan jika success

                        $('#updateData').modal('hide');
                        console.log(result);
                        $('#DataTable_User').DataTable().ajax.reload();
                        Swal.fire({
                            icon: 'success',
                            title: 'Data has been updated',
                        })

                    }).fail((error) => {

                        console.log(error)
                    })
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Email / Phone Sudah Terpakai',
                    })
                }
            })
        }
    })
    //isi dari object kalian buat sesuai dengan bentuk object yang akan di pos
})









// Table History
$(document).ready(function () {

    var data = parseInt(document.getElementById("UserId").value)

    $('#DataTable_History').DataTable({
        language: {
            paginate: {
                next: '<i class="fas fa-angle-right">',
                previous: '<i class="fas fa-angle-left">'
            }
        },
        dom: 'lBfrtip',
        buttons: [
            //'copy', 'csv', 'excel', 'pdf', 'print'
            {
                extend: 'pdf', title: 'Data Master User',
                className: 'btn btn-sm btn-danger glyphicon glyphicon-file',
                text: '<i class="far fa-file-pdf"></i>',
                titleAttr: 'PDF',
                exportOptions: {
                    columns: [0, 1, 2, 3]
                }
            },
            {
                extend: 'excel', title: 'Data Master User',
                className: 'btn btn-sm btn-success  glyphicon glyphicon-list-alt',
                text: '<i class="fas fa-file-excel"></i>',
                titleAttr: 'Excel',
                exportOptions: {
                    columns: [0, 1, 2, 3]
                }
            },
            {
                extend: 'csv', title: 'Data Master User',
                className: 'btn btn-sm btn-success  glyphicon glyphicon-save-file',
                text: '<i class="fas fa-file-csv"></i>',
                titleAttr: 'CSV',
                exportOptions: {
                    columns: [0, 1, 2, 3]
                }
            },
            {
                extend: 'copy', title: 'Data Master User',
                className: 'btn btn-sm btn-warning  glyphicon glyphicon-duplicate',
                text: '<i class="far fa-copy"></i>',
                titleAttr: 'COPY',
                exportOptions: {
                    columns: [0, 1, 2, 3]
                }
            },
            {
                extend: 'print', title: 'Data Master User',
                className: 'btn btn-sm btn-dark  glyphicon glyphicon-print',
                text: '<i class="fas fa-print"></i>',
                titleAttr: 'PRINT',
                exportOptions: {
                    columns: [0, 1, 2, 3]
                }
            }
        ],
        initComplete: function () {
            var btns = $('.dt-button');
            //btns.addClass('btn btn-primary btn-sm');
            btns.removeClass('dt-button');
        },
        "ajax": {
            "url": "https://localhost:44306/API/Transaction/GetTransaction",
            "dataType": "json",
            "dataSrc": function (json) {
                return json.filter(function (item) {
                    return item.userId == data;
                });
            },
        },
        "columns": [
            {
                "data": null, "sortable": false,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            {
                "data": "course"
            },
            {
                "data": "price",
                render: function (data) {
                    var result = data;
                    return `<span>Rp.${result}</span>`
                }
            },
            {
                "data": "status"
            },
            {
                "data": "date",
                "render": function (data) {
                    var date = new Date(data);
                    var month = date.getMonth() + 1;
                    return date.getDate() + "/" + (month.length > 1 ? month : "0" + month) + "/" + date.getFullYear();
                    //    //return date;
                }
            }
        ]

    });

})

//MY COURSE
let UserrId = document.getElementById("UserIdNihh").value;
console.log(UserrId)

$.ajax({
    url: "https://localhost:44306/API/Transaction/GetTransaction",
}).done((result) => {
    console.log(result);
    let itemUser = result.filter(e => e.userId === parseInt(UserrId) && e.status == "Accept");
    console.log(itemUser.course);

    let text = "";
    //let list_items = val.name;
    $.each(itemUser, function (key, val) {
        //console.log(val.name);
        text +=

            `<div class="card">
                <!-- Card header -->
                <div class="card-header">
                    <div class="row align-items-center">
                        <div class="col-8">
                            <!-- Title -->
                            <h5 class="h3 mb-0">${val.course}</h5>
                        </div>
                    </div>
                </div>
                <!-- Card image -->
                <!-- List group -->
                <!-- Card body -->
                <div class="card-body">
                    <span class="h3 mb-0">Rp.${val.price}</span>
                    <p class="card-text mb-4">${val.description}</p>

                    <a href="#" onClick="LearnCourse('${val.courseId}')" class="btn btn-primary">Learn</a>
                </div>
            </div>`
    });
    //console.log(text);
    $("#card3").html(text);


}).fail((error) => {
    console.log(error);
})

//SECTION
function LearnCourse(data) {

    window.location.replace("/Customer/Section")
    localStorage.setItem("course", data)

}

$.ajax({
    url: "https://localhost:44306/API/Section",
}).done((result) => {


    var courseIDs = localStorage.getItem("course")


    GrupSections = result.filter(g => g.courseId == courseIDs);

    console.log(GrupSections);

    let text = "";
    //let list_items = val.name;
    $.each(GrupSections, function (key, val) {
        //console.log(val.name);
        text +=

            `<div class="card">
                <!-- Card header -->
                <div class="card-header">
                    <div class="row align-items-center">
                        <div class="col-8">
                            <!-- Title -->
                            <h5 class="h3 mb-0">${val.name}</h5>
                        </div>
                    </div>
                </div>
                <!-- Card image -->
                <!-- List group -->
                <!-- Card body -->
                <div class="card-body">
                    <p class="card-text mb-4">${val.description}</p>
                    <iframe width="420" height="315" src="${val.link}">
                    </iframe>
                </div>
            </div>`
    });
    //console.log(text);
    $("#card4").html(text);
})




