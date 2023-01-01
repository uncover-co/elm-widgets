All elm-widgets modules follow a strict set of API patterns.

## The view

All modules expose their main use case as `view`. It should accept 2 arguments. First, a list of optional attributes, second a record of required arguments.

```elm
W.Button.view [ W.Button.small ]
  { label = [ H.text "Click me!" ]
  , onClick = DoSomething
  }
```

If a module exposes a view function that could take different arguments for different outputs, prefer to expose two or more view functions with the required arguments for each use case.

```
-- DON'T


W.Button.view []
  { onClick = Nothing
  , href = "go-somewhere"
  , label = [ H.text "I'm a link button!" ]
  }
  
-- DO


W.Button.view []
  { onClick = DoSomething
  , label = [ H.text "I'm a button"]
  }

W.Button.viewLink []
  { href = "go-somewhere"
  , label = [ H.text "I'm a button"]
  }
```

If the exposed view function takes only one required argument and that argument is the "content" of a container view, we should make it receive that argument directly. Otherwise, use a record even if it contains a single property for readibility.

```
W.Modal.view []
  [ H.text "Hello from modal!"
  ]
```

## The attributes

Attributes should be used for truly optional values for the view. If attributes are being used for toggling widly different behaviors, prefer to use multiple view functions.

All module attributes should expose two common attributes:

- `W.htmlAttrs` - a way for the user to pass in html attributes directly to the main element of a specific view.
- `W.noAttr` - a noop attribute, useful for toggling optional attributes without doing lots of list contatenations.

All modules should expose attribute types as `Attribute msg` - even if the attributes are not using `msg` yet, this is useful for backwards compatibility. If we keep it that way, we can add attributes that use `msg` in the future without creating a major version. 

## Theming and colors

All views should be created as if there were no CSS resets applied to the root application (or really crazy CSS changes). That means adding things like `box-border` classes whenever it makes sense, specifying `font-text`, etc.

Colors should be used with caution. Whenever possible let's stick to elm-theme variables since those make the views automatically compatible with different themes. Hard-coded colors should only be acceptable for custom user-created variants.
