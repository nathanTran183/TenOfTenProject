var app = new Vue({
    el: '#app',
    data: {
        messages: {
            phoneStatus: "Your phone number isn't verified yet",
            phoneButton: "Verify your phone number"
        },
        phoneVerified: false,
        phone_token: ""
    },
    methods: {
        verifyPhone: function() {
            AccountKit.login("PHONE", {countryCode: "+65", phoneNumber: "91234567"},
            this.accountKitCallback);
            this.messages.phoneButton = "Verifying...";
        },
        accountKitCallback: function(response) {
            var vm = this;
            if (response.status === "PARTIALLY_AUTHENTICATED"  ) {
                code = response.code;
                csrf = response.state;

                axios.post('/Replace/With/Actual/Endpoint', {
                    code: code,
                    csrf_token : csrf
                })
                .then(function (response) {
                    vm.phoneVerified = true;
                    vm.messages.phoneStatus = "";
                    vm.messages.phoneButton = "Your number is verified";
                    vm.phone_token = response.data.phone_token;
                })
                .catch(function (error) {
                    console.log(error.response);
                    vm.messages.phoneButton = "Verify your phone number";
                    try {
                        error.response.data.err === 100;
                        vm.messages.phoneStatus = "This phone number has been used before";
                    } catch(err) {
                        vm.messages.phoneStatus = "Please try again";
                    }
                });

            } else {
                if (!this.phoneVerified) {
                    this.messages.phoneButton = "Verify your phone number";
                }
            }
        }
    }
});


