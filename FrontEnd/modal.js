const body = document.body;

// Function to show the modal
function openModal() {
  modal = document.querySelector("#modal"); 
  modal.classList.add("visible");
  body.classList.add("overflow-hidden"); 
}

// Function to close the modal
function closeModalHandler() {
    modal.classList.remove("visible");
    body.classList.remove("overflow-hidden");
}

// Attach event listener to the document 
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('vectorx')) {
    closeModalHandler();
  }
});

  // Load token from session storage
  document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("token");
  fetchImagesAndUpdateModal(token);
});

//******************************************************** */ Function to fetch all images from the API and update the modal images
  async function fetchImagesAndUpdateModal(tokenFromSession) {
    console.log("Received token:", tokenFromSession);
    const apiUrl = "http://localhost:5678/api/works";
    const modalImagesContainer = document.querySelector(".galerie-photo-container");

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const imageUrls = data.map(item => item.imageUrl);
      const ids = data.map(item => item.id);
      console.log(ids);
      
      
      // Create figure elements with images and add them to the modal container
      imageUrls.forEach((imageUrl, index) => {
        const figureElement = document.createElement("figure");
        figureElement.classList.add("galerie-photo-fig");
        figureElement.dataset.img = (index + 1).toString();

        const imgElement = document.createElement("img");
        imgElement.src = imageUrl;
        imgElement.classList.add("galerie-photo-img");

        const figcaptionElement = document.createElement("figcaption");
        figcaptionElement.textContent = "éditer";

        const vector1Element = document.createElement("img");
        vector1Element.src = "./assets/icons/Group 10.png";
        vector1Element.alt = "icone poubelle";
        vector1Element.classList.add("galerie-photo-vector", "vector1");

        // Add the img, figcaption, and vector1 elements to the figure element
        figureElement.appendChild(imgElement);
        figureElement.appendChild(figcaptionElement);
        figureElement.appendChild(vector1Element);

        // Add the figure element to the modal container
        modalImagesContainer.appendChild(figureElement);
      });

      console.log("Images updated in the modal.");
    } catch (error) {
      console.error('Error fetching images:', error);
    }

    //******************************************** */ Attach event listeners to the "vector1" to delete images in the modal
  const vector1Elements = document.querySelectorAll(".galerie-photo-vector.vector1");
  vector1Elements.forEach(vector1Element => {
  vector1Element.addEventListener("click", async () => {
    const figureElement = vector1Element.closest(".galerie-photo-fig");
    if (figureElement) {
      const imgElement = figureElement.querySelector(".galerie-photo-img");
      const dataImgValue = figureElement.dataset.img;

      if (tokenFromSession) {
        try {
          const apiUrl = `http://localhost:5678/api/works/${getImageIdFromImageUrl(imgElement.src)}`;
          const response = await fetch(apiUrl, {
            method: "DELETE",
            headers: {
              'Authorization': `Bearer ${tokenFromSession}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to delete image');
          }

          // Remove all elements with the same data-img value
          const elementsWithSameDataImg = document.querySelectorAll(`[data-img="${dataImgValue}"]`);
          elementsWithSameDataImg.forEach(element => {
            element.remove();
          });

          console.log(`All elements with data-img="${dataImgValue}" deleted.`);
        } catch (error) {
          console.error('Error deleting image:', error);
        }
      } else {
        console.error("Image ID not found.");
      }
    } else {
      console.error("Parent figure element not found.");
    }
  });
});

// Function to get images from URL
function getImageIdFromImageUrl(imageUrl) {
  const parts = imageUrl.split('/');
  const filename = parts[parts.length - 1];
  const imageId = filename.split('.')[0];
  return imageId;
}

//********************************************** */ Delete all images with "supprimer la galerie"
const deleteButton = document.querySelector(".delete");
deleteButton.addEventListener("click", async () => {
  const figureElements = document.querySelectorAll('figure');
  const deletedDataImgValues = [];

  // Get the gallery container
  const galleryContainer = document.querySelector('.gallery');

  if (figureElements.length > 0) {
    if (tokenFromSession) {
      try {
        // Loop through each figure element
        for (const figureElement of figureElements) {
          // Check if the figure element has the data-img attribute
          const dataImgValue = figureElement.dataset.img;
          if (!dataImgValue) {
            console.log("Skipping figure element without data-img attribute.");
            continue;
          }

          const imgElement = figureElement.querySelector(".galerie-photo-img");
          if (!imgElement) {
            continue;
          }

          const apiUrl = `http://localhost:5678/api/works/${getImageIdFromImageUrl(imgElement.src)}`;
          const response = await fetch(apiUrl, {
            method: "DELETE",
            headers: {
              'Authorization': `Bearer ${tokenFromSession}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to delete image');
          }

          // Add the data-img value to the list of deleted values
          deletedDataImgValues.push(dataImgValue);

          // Remove the current figure element from the modal
          figureElement.remove();

          console.log(`Element with data-img="${dataImgValue}" deleted.`);
        }

        // Remove all figure elements from the gallery container
        const galleryFigureElements = galleryContainer.querySelectorAll('figure');
        galleryFigureElements.forEach((figureElement) => {
          figureElement.remove();
        });

        console.log("All elements with data-img deleted from the modal and the gallery.");
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    } else {
      console.error("Image ID not found.");
    }
  } else {
    console.error("No figure elements found.");
  }
});
  }

  //******************************************* */ Show second page of the modal when clicking on "ajouter photo" button
  document.addEventListener('DOMContentLoaded', function() {
    const galeriePhoto2 = document.querySelector('.galerie-photo2');
    const addPicture = document.querySelector('.add-picture-btn');
    const leftArrow = document.querySelector('.vector-left-arrow');
    
    addPicture.onclick = function() {
      galeriePhoto2.classList.remove('display-none');
    };

    leftArrow.onclick = function() {
      galeriePhoto2.classList.add('display-none');
    };

  });

  //********************************************** */ function to show the selected image file
  function handleImageSelect(event) {
    const selectedImage = document.getElementById('selectedImage');
    const file = event.target.files[0]; // Get the selected file;
    const textElement = document.querySelector('.text');
    const addButton = document.querySelector('.ajouter-photo-btn');
  
    if (file) {
      const reader = new FileReader();
  
      reader.onload = function(e) {
        selectedImage.src = e.target.result; // Set the chosen image as the src of the <img> element
        textElement.style.display = 'none'; 
        addButton.style.display = 'none'; 
  
        // resize the image
        selectedImage.classList.add('selected-img2');
      };
  
      reader.readAsDataURL(file); // Read the selected file as data URL
    }
  }

 //*************************************** */ Add an event listener to the "valider" button
document.addEventListener('DOMContentLoaded', function() {
  const validerBtn = document.querySelector('.valider-picture-btn');
  validerBtn.addEventListener('click', createNewGalleryItem);
  const textElement = document.querySelector('.text');
    const addButton = document.querySelector('.ajouter-photo-btn');

     // Store the original source of the placeholder image
     const originalImageSrc = './assets/icons/picture-svgrepo-com1.png';
     const originalImageClass = 'selected-img';

   // Attach click event to the "Valider" button to hide the second page
   validerBtn.onclick = function() {
    const galeriePhoto2 = document.querySelector('.galerie-photo2');
    galeriePhoto2.classList.add('display-none');

    // Reset the selectedImage source to the original placeholder image
    selectedImage.src = originalImageSrc;
    selectedImage.className = originalImageClass;

    // Clear other inputs and reset button color
    titreInput.value = "";
    categorieInput.value = "";
    validerBtn.classList.remove('green-color');

    // Show the "ajouter photos" div back to normal
    textElement.style.display = 'block'; 
    addButton.style.display = 'block'; 
};

//************************************************ */ Function to add the new image to the gallery
document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("token");
  createNewGalleryItem(token);
});
async function createNewGalleryItem(token) {
  token.preventDefault(); // Prevent form submission

  const selectedImage = document.getElementById('selectedImage');
  const titreInput = document.querySelector('.titre-placeholder');
  const categorieInput = document.querySelector('.categorie-placeholder');
  const gallery = document.querySelector('.gallery');

  if (selectedImage.src && titreInput.value.trim() !== "" && categorieInput.value !== "") {
      const requestData = {
          id: 0,
          title: titreInput.value,
          imageUrl: selectedImage.src,
          categoryId: categorieInput.value,
          userId: 0
      };

      let formData = new FormData()
      formData.append("id", 0)
      formData.append("title",  titreInput.value)
      formData.append("imageUrl",  selectedImage.src)
      formData.append("categoryId", categorieInput.value)
      formData.append("userId", 0)

      try {
          const response = await fetch('http://localhost:5678/api/works', {
              method: 'POST',
              headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': 'Bearer ' + token
              },
              body: formData
          });

          if (response.ok) {
              // Successfully added to the server, now add to the gallery
              const responseData = await response.json();

              // Create new elements and append them to the gallery
              const newFigure = document.createElement('figure');
              const newImage = document.createElement('img');
              const newFigCaption = document.createElement('figcaption');

              // Set class name of the figure to the chosen category
              newFigure.className = categorieInput.value;

              // Set the src of the new image to the selected image
              newImage.src = selectedImage.src;

              // Set the text content of the figcaption to the value of the title input
              newFigCaption.textContent = titreInput.value;

              // Append the new elements to the gallery
              newFigure.appendChild(newImage);
              newFigure.appendChild(newFigCaption);
              gallery.appendChild(newFigure);

              closeModalHandler();

              // Add the image to the modal
              addImageToModal(selectedImage.src);
          } else {
              console.error('Failed to add the image to the server.');
          }
      } catch (error) {
          console.error('An error occurred:', error);
      }
  }
}
  
  //********************************************** */ function to add the new image to the modal
  let imageIndex = 11;
  function addImageToModal(src) {
    const modalImagesContainer = document.querySelector('.galerie-photo-container'); // Update the selector accordingly

    const figureElement = document.createElement("figure");
    figureElement.classList.add("galerie-photo-fig");
    figureElement.dataset.img = (imageIndex + 1).toString();

    const imgElement = document.createElement("img");
    imgElement.classList.add("galerie-photo-img");

    // Set the src of the imgElement to the passed src
    imgElement.src = src;

    const figcaptionElement = document.createElement("figcaption");
    figcaptionElement.textContent = "éditer";

    const vector1Element = document.createElement("img");
    vector1Element.src = "./assets/icons/Group 10.png";
    vector1Element.alt = "icone poubelle";
    vector1Element.classList.add("galerie-photo-vector", "vector1");

    // Add the img, figcaption, and vector1 elements to the figure element
    figureElement.appendChild(imgElement);
    figureElement.appendChild(figcaptionElement);
    figureElement.appendChild(vector1Element);

    // Add the figure element to the modal container
    modalImagesContainer.appendChild(figureElement);

    modalImagesContainer.appendChild(figureElement);
  
    imageIndex++; // Increment the index for the next image
}


  function checkFormFields() {
    if (selectedImage.src && titreInput.value.trim() !== "" && categorieInput.value !== "") {
        validerBtn.classList.add('green-color');
    } else {
        validerBtn.classList.remove('green-color');
    }
  }

  // Add event listeners for input changes
  const selectedImage = document.getElementById('selectedImage');
  const titreInput = document.querySelector('.titre-placeholder');
  const categorieInput = document.querySelector('.categorie-placeholder');

  selectedImage.addEventListener('load', checkFormFields);
  titreInput.addEventListener('input', checkFormFields);
  categorieInput.addEventListener('change', checkFormFields);
});

