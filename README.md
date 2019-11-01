# "Summarize" jQuery plugin
Plugin developed to summarize long content post-render.

## Built with
* [jQuery (2.1.1)](https://code.jquery.com/jquery-2.1.1.min.js)

## Usage
### Invocation
#### Direct invocation 
Direct call to the plugin supplying only the required jQuery element identifier.
```
$.Summarize('#my-summary-element');
```

#### Direct invocation with custom properties
Direct call to the plugin supplying the required jQuery element identifier as well as custom properties to extend the [API](#api).
```
$.Summarize('#my-summary-element', {
    behavior:       'toggle',
    limit:          3,
    showEllipsis:   true,
});
```

#### Function expression (recommended)
The plugin can be stored in a variable to be referenced throughout the application. This method of invocation allows for further [API](#api) functionality.
```
var MySummary = $.Summarize('#my-summary-element', {
    behavior:   'toggle',
    animate:    true,
    limit:      1
});
```

### API
#### Properties
* ***behavior*** (string) (Default: "toggle")\
Sets the summarization behavior. Set to **"toggle"** to make the summary content expandable/collapsible; **"split"** to split the content between **[2]** DOM elements ("splitTargets" property must be supplied); **"hide"** to display only the summarized content without expandability.

* ***animate*** (bool) (Default: true)\
Expand and collapse summarized content with a transition. Only applicable when the "behavior" property is set to **"toggle"** or **"split"**.

* ***key*** (string) (Default: "\*")\
Target specific elements of the original content to be summarized by, or set to **"*"** to comb through all elements.

* ***limit*** (int) (Default: 3)\
Limit of summary content elements set by the "key" property. 

* ***showEllipsis*** (bool) (Default: false)\
Setting to append an ellipsis to the last element in the summary.

* ***splitTargets*** (array) (Default: [])\
An array of **[2]** designated DOM elements to split summary content between. The first array item ("primary" target) will catch the summarized content determined by the **"key"** and **"limit"** properties. The second array item ("secondary" target) will catch the remaining content. Only applicable when the "behavior" property is set to **"split"**.

* ***showContinueLink*** (bool) (Default: true)\
Setting to display the "Continue" link at the end of the summary.

* ***continueLinkText*** (string | array) (Default: "Continue")\
Accepts a string for the "Continue" link inner text. Alternatively, an array of **[2]** strings can be supplied where the first item represents the "expand" state text (ex: "Read more") and the second item represents the "collapse" state text (ex: "Read less").

* ***continueLinkHref*** (string) (Default: "#")\
Accepts a URL string to change the "Continue" link into a page link. Only applicable when the "behavior" property is set to **"hide"**.

* ***continueLinkClasses*** (string) (Default: "")\
Accepts a string to add additional CSS classes to the "Continue" link.

* ***onComplete*** (function) (Default: null)\
Accepts a function to chain additional functionality after the plugin has been successfully initialized/reinitialized.

#### Functions
* ***destroy()***\
Removes the plugin from the jQuery UI Widget Factory and returns it to its pre-initialized state.  Refer to the [jQuery UI API documentation](https://api.jqueryui.com/jQuery.widget/#method-destroy) for more information.
```
# Invoke plugin via function expression
var MySummary = $.Summarize('#my-summary-element');

# Custom click event
$('#destroy-summarize').click(function(e){
    MySummary.destroy();
});
```

* ***reset()***\
Similar to the "destroy()" function, but will reinitialize the plugin. Commonly used for viewport resizing and/or orientation changes where DOM element dimensions need to be recalculated.
```
# Invoke plugin via function expression
var MySummary = $.Summarize('#my-summary-element');

# Window resize event
$(window).on('resize', function(e){
    MySummary.reset();
});
```