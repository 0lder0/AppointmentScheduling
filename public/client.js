const {createApp} = Vue

createApp({
    data() {
        return {
            registerEmail: '',
            registerPassword: '',
            registerModal: null,
            loginEmail: '',
            loginPassword: '',
            loginModal: null,
            loggedIn: false,
            sessionId: null,
            userId: null
        }
},
    async created() {
        if (localStorage.getItem('sessionId')) {
            this.sessionId = localStorage.getItem('sessionId');
        }
        if (this.sessionId) {
            try {
                this.loggedIn = true;
                this.userId = response.data.userId;
            } catch (error) {
                console.log(error)
            }
        }
    },
    methods: {
        createUser() {
            axios.post('/users', {
                email: this.registerEmail,
                password: this.registerPassword
    })
        .then(response => {
            alert(response.data)
            this.registerPassword = '';
            this.registerModal.hide();
        })
        .catch(error => {
            this.registerPassword = '';
            alert(error.response.data)
        })
},
        showSignUpModal() {
            this.registerModal = new bootstrap.Modal(document.getElementById("register-modal"), {});
            this.registerModal.show();
        },
        loginUser() {
            axios.post('/sessions', {
                email: this.loginEmail,
                password: this.loginPassword
            })
                .then(response => {
                    alert(response.data.message)
                    this.loginModal.hide();
                    this.loginPassword = '';
                    this.loggedIn = true;


                    this.sessionId = response.data.sessionId;
                    this.userId = response.data.userId;
                    console.log(response)

                    localStorage.setItem('sessionId', this.sessionId + this.userId);
                })
                .catch(error => {
                    this.loginPassword = '';
                    alert(error.response.data.message)
                })
        },
        showLoginModal() {
            this.loginModal = new bootstrap.Modal(document.getElementById("login-modal"), {});
            this.loginModal.show();
        },
        logoutUser() {
            this.loggedIn = false;
            this.sessionId = null;
            this.userId = null;
            localStorage.removeItem('sessionId');

        }
    }

}).mount('#app')