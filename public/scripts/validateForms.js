const formsToValidate = document.querySelectorAll('.needs-validation')
for (form of formsToValidate){
    form.addEventListener('submit', function(e){
        if (!this.checkValidity()){
            e.preventDefault();
            e.stopPropagation();
        }
        form.classList.add('was-validated');
    })
}

const images = document.querySelector('#images');
const fileNames = document.querySelector('#file-names');
const noImage = document.querySelector('#no-image');
const maxFiles = document.querySelector('#max-files');

if (images) {
    images.addEventListener('change', function () {
        maxFiles.classList.add('d-none'); // hide warning by default
        const files = Array.from(this.files, f => f.name); // get an array w/ just the filenames
        if (files.length > 3) {
            this.value = ''; // reset file input
            fileNames.innerHTML = '';
            noImage.classList.add('d-none'); // hide the previous warning
            maxFiles.classList.remove('d-none'); // show warning
        } else if (files.length > 1) {
            fileNames.innerHTML = files.join('<br>'); // print the filenames into separate lines
        } else {
            fileNames.innerHTML = '';
        }
    });
}