const {createApp} = Vue

createApp({
    data() {
        return {
            email: '',
            password: '',
            registerModal: null
        }
},
    methods: {
        createUser() {
            axios.post('/users', {
                email: this.email,
                password: this.password
    })
        .then(response => {
            alert(response.data)
            this.registerModal.hide();
        })
        .catch(error => {
            alert(error.response.data)
        })
},
        showSignUpModal() {
            this.registerModal = new bootstrap.Modal(document.getElementById("register-modal"), {});
            this.registerModal.show();
        }
    }
}).mount('#app')