document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    console.log(name, email);
    alert("Form submitted!");
});
