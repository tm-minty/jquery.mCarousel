jquery-carousel
======================
Plugin for jQuery. Fully customizable carousel.

## CSS and Markup

* Elements container should be placed in wrapper
* Wrapper should have ```overflow: hidden;``` property
* Elements container should be relative positioned (```position: relative;```)
* Elements: ```float: left;```

### Example
**html**
```html
<a class="back" href="#">&lt;</a>
<div class="wrapper"> <!-- This is wrapper -->
  <ul> <!-- This is elements container -->
    <li>Element 1</li>
    <li>Element 2</li>
    <li>Element 3</li>
    <li>Element 4</li>
  </ul>
</div>
<a class="forward" href="#">&gt;</a>
```
**css**
```css
.wrapper{ overflow: hidden; }
.wrapper ul{ position: relative; }
.wrapper li{ width: 100px; float: left; }
```

## Usage
```javascript
$('.wrapper').carousel({
  backButton: '.back', // selector or object // back button
  forwardButton: '.forward', // selector or object // forward button
  elementsContainer: '.wrapper>ul', // selector or object // elements container
  elements: 'li', // selector // elements, will be selected from $(elementsContainer)
  slideCount: 3, // count of elements to slide
  duration: 500 // ms, animation speed
});
```

