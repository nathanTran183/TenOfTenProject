var app = new Vue({
    el: '#app',
    data: {
        // email: "", username: "", password: "",
        messages: {
            // error: "",
            phoneStatus: "Your phone number isn't verified yet",
            phoneButton: "Verify your phone number"
        },
        phoneVerified: false,
        phone_token: ""
    },
    methods: {
        verifyPhone: function () {
            var num1 = 1634067196;
            AccountKit.login("PHONE", {countryCode: "+84", phoneNumber: 1675699793},
                this.accountKitCallback);
            this.messages.phoneButton = "Verifying...";
        },
        accountKitCallback: function (response) {
            var vm = this;
            if (response.status === "PARTIALLY_AUTHENTICATED") {
                code = response.code;
                csrf = response.state;
                console.log('code here: ' + code);
                console.log('csrf: ' + csrf);

                axios.post('http://localhost:3000/api/auth/phoneNumber', {
                    code: code,
                    csrf_token: csrf
                })
                    .then(function (response) {
                        vm.phoneVerified = true;
                        vm.messages.phoneStatus = "";
                        vm.messages.phoneButton = "Your number is verified";
                        vm.phone_token = response.data.phone_token;
                        console.log(vm.phone_token);
                    })
                    .catch(function (error) {
                        console.log(error);
                        vm.messages.phoneButton = "Verify your phone number";
                        try {
                            error.response.data.err === 100;
                            vm.messages.phoneStatus = "This phone number has been used before";
                        } catch (err) {
                            vm.messages.phoneStatus = "Please try again";
                        }
                    });

            } else {
                if (!this.phoneVerified) {
                    this.messages.phoneButton = "Verify your phone number";
                }
            }
        },
    }
});


