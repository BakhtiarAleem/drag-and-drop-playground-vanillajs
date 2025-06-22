const items = document.querySelectorAll('.tool-item')
const dropArea = document.getElementById('tool-content')
const toolbar = document.getElementById('font-toolbar')
const fontFamily = document.getElementById('font-family')
const fontSize = document.getElementById('font-size')
const boldBtn = document.getElementById('bold-btn')
const italicBtn = document.getElementById('italic-btn')

let selectedHeading = null


dropArea.addEventListener('click', (e) => {
    if(e.target.tagName === 'H1'){
        selectedHeading = e.target;

        const rect = selectedHeading.getBoundingClientRect();
        toolbar.style.left = `${rect.left}px`;
        toolbar.style.top = `${rect.top - 50}px`;
        toolbar.style.display = "block";
    }
    else{
        toolbar.style.display = "none";
        selectedHeading = null;
    }
})

fontFamily.addEventListener('change', (e) => {
    if(selectedHeading){
        console.log('font family', e.target.value)
        selectedHeading.style.fontFamily = e.target.value;
    }
})

fontSize.addEventListener('change', (e) => {
    if(selectedHeading){
        selectedHeading.style.fontSize = e.target.value;
    }
})

boldBtn.addEventListener('click', (e) => {
    if(selectedHeading){
        selectedHeading.style.fontWeight = selectedHeading.style.fontWeight === 'bold' ? 'normal' : 'bold';
    }
})

italicBtn.addEventListener('click', (e) => {
    if(selectedHeading){
        selectedHeading.style.fontStyle = selectedHeading.style.fontStyle === 'italic' ? 'normal' : 'italic';
    }
})



// For Dragable Element
function makeDragableElement(initialDragElement) {
    let offsetX, offsetY;
    const resizeThreshold = 10;
    initialDragElement.addEventListener('mousedown', (draggingElementItem) => {


        const rect = initialDragElement.getBoundingClientRect();
        const nearRightEdge = draggingElementItem.clientX > rect.right - resizeThreshold;
        const nearBottomEdge = draggingElementItem.clientY > rect.bottom - resizeThreshold;

        if(nearRightEdge || nearBottomEdge) return;


        offsetX = draggingElementItem.clientX - initialDragElement.getBoundingClientRect().left;
        offsetY = draggingElementItem.clientY - initialDragElement.getBoundingClientRect().top;

        function onMouseMove(e){
            initialDragElement.style.left = `${e.clientX - offsetX}px`;
            initialDragElement.style.top = `${e.clientY - offsetY}px`;
        }

        function onMouseUp (){
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);


    })
}


// For Heading Text
function textDrop(id, size) {
    const wrapper = document.createElement('div');
    wrapper.id = id;
    wrapper.className = 'text-drop-resizeable';
    wrapper.contentEditable = true;

    const heading = document.createElement('h1');
    heading.textContent = 'Your Content';
    heading.style.fontSize = `${size}px`
    heading.contentEditable = true;

    wrapper.appendChild(heading)
    return wrapper;
}


// For Image Drop
function imageDrop(id){
    const wrapper = document.createElement("div");
    wrapper.id = id;
    wrapper.classList = 'image-drop-draggable'

    const img = document.createElement('img');
    img.src = './assets/images/placeholder.png';
    img.style.objectFit = 'cover';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = "none";

    wrapper.addEventListener("dblclick", () => fileInput.click());

    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if(!file) return
        const reader = new FileReader();
        reader.onload = (event) => {
            img.src = event.target.result;
        }
        reader.readAsDataURL(file)
    })

    wrapper.appendChild(img)
    wrapper.appendChild(fileInput)
    return wrapper;

}


// item present in the tool
items.forEach(item => {
    item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', e.target.id)
    })
})

// when dragging item
dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.style.borderColor = "#7f7fc2";
})

// drop functionality
dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
     const original = document.getElementById(id)
    if(original){
        let dropEl;
        if(original.id === 'heading' || original.dataset.select === 'typography'){
            const size = original.dataset.size
            dropEl = textDrop(`clone-${id}-${Date.now()}`, size)
        }
        else if(original.id === 'image'){
            dropEl = imageDrop(`clone-${id}-${Date.now()}`)
        }
        else{
            dropEl = original.cloneNode(true);
            dropEl.id = `clone-${id}-${Date.now()}`;
        }
        dropEl.classList.add('draggable-element');
        dropEl.style.left = `${e.offsetX}px`;
        dropEl.style.top = `${e.offsetY}px`;

        makeDragableElement(dropEl);
        dropArea.appendChild(dropEl);
        
    }
})
