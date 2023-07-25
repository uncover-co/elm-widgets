module W.Modal exposing
    ( view
    , viewToggle, viewToggable, viewToggableWithAutoClose
    , absolute, maxWidth, noBlur, zIndex
    , htmlAttrs, noAttr, Attribute
    )

{-|

@docs view


# Togglable

If you don't want to manage your modal open state at all, use the toggable version.

    W.Modal.viewToggable []
        { id = "toggable-modal"
        , content = [ text "Hello!" ]
        }

    W.Modal.viewToggle "toggable-modal"
        [ W.Button.viewDummy []
            [ text "Click here to toggle modal" ]
        ]

@docs viewToggle, viewToggable, viewToggableWithAutoClose


# Styles

@docs absolute, maxWidth, noBlur, zIndex


# Html

@docs htmlAttrs, noAttr, Attribute

-}

import Html as H
import Html.Attributes as HA
import Html.Events as HE



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { absolute : Bool
    , zIndex : Int
    , blur : Bool
    , maxWidth : Int
    , htmlAttributes : List (H.Attribute msg)
    }


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes msg
defaultAttrs =
    { absolute = False
    , zIndex = 1000
    , blur = True
    , maxWidth = 480
    , htmlAttributes = []
    }


{-| -}
absolute : Attribute msg
absolute =
    Attribute <| \attrs -> { attrs | absolute = True }


{-| -}
noBlur : Attribute msg
noBlur =
    Attribute <| \attrs -> { attrs | blur = False }


{-| -}
maxWidth : Int -> Attribute msg
maxWidth v =
    Attribute <| \attrs -> { attrs | maxWidth = v }


{-| -}
zIndex : Int -> Attribute msg
zIndex v =
    Attribute <| \attrs -> { attrs | zIndex = v }


{-| Attributes applied to the modal's content wrapper.
-}
htmlAttrs : List (H.Attribute msg) -> Attribute msg
htmlAttrs v =
    Attribute <| \attrs -> { attrs | htmlAttributes = v }


{-| -}
noAttr : Attribute msg
noAttr =
    Attribute identity



-- Main


type Modal msg
    = Stateless { id : String, content : List (H.Html msg), closeOnBackgroundClick : Bool }
    | Stateful { isOpen : Bool, onClose : Maybe msg, content : List (H.Html msg) }


toContent : Modal msg -> List (H.Html msg)
toContent modal =
    case modal of
        Stateless { content } ->
            content

        Stateful { content } ->
            content


toClosable : Modal msg -> Bool
toClosable modal =
    case modal of
        Stateless { closeOnBackgroundClick } ->
            closeOnBackgroundClick

        Stateful { onClose } ->
            onClose /= Nothing


{-| -}
viewToggle : String -> List (H.Html msg) -> H.Html msg
viewToggle id_ content =
    H.label [ HA.for id_ ] content


{-| -}
viewToggable :
    List (Attribute msg)
    ->
        { id : String
        , content : List (H.Html msg)
        }
    -> H.Html msg
viewToggable attrs props =
    view_ attrs (Stateless { id = props.id, content = props.content, closeOnBackgroundClick = False })


{-| -}
viewToggableWithAutoClose :
    List (Attribute msg)
    ->
        { id : String
        , content : List (H.Html msg)
        }
    -> H.Html msg
viewToggableWithAutoClose attrs props =
    view_ attrs (Stateless { id = props.id, content = props.content, closeOnBackgroundClick = True })


{-| -}
view :
    List (Attribute msg)
    ->
        { isOpen : Bool
        , onClose : Maybe msg
        , content : List (H.Html msg)
        }
    -> H.Html msg
view attrs props =
    view_ attrs (Stateful props)


{-| -}
view_ : List (Attribute msg) -> Modal msg -> H.Html msg
view_ attrs_ props =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_

        viewCloseTrigger : H.Html msg
        viewCloseTrigger =
            case props of
                Stateless { id, closeOnBackgroundClick } ->
                    if closeOnBackgroundClick then
                        H.label
                            [ HA.for id
                            , HA.class "ew-block"
                            , HA.class "ew-absolute ew-inset-0"
                            ]
                            []

                    else
                        H.text ""

                Stateful { onClose } ->
                    case onClose of
                        Just onClose_ ->
                            H.label
                                [ HE.onClick onClose_
                                , HA.class "ew-absolute ew-inset-0"
                                ]
                                []

                        Nothing ->
                            H.text ""

        wrapper : H.Html msg
        wrapper =
            H.div
                [ HA.attribute "role" "dialog"
                , HA.class "ew-modal ew-hidden ew-opacity-0 ew-inset-0 ew-border-0 ew-bg-black/30"
                , HA.style "z-index" (String.fromInt attrs.zIndex)
                , HA.classList
                    [ ( "ew-absolute", attrs.absolute )
                    , ( "ew-fixed", not attrs.absolute )
                    , ( "ew-modal--is-open"
                      , case props of
                            Stateful { isOpen } ->
                                isOpen

                            _ ->
                                False
                      )
                    ]
                , if attrs.blur then
                    HA.style "backdrop-filter" "blur(1px)"

                  else
                    HA.class ""
                ]
                [ viewCloseTrigger
                , H.div
                    [ -- Visibility and animations are handled by this class
                      HA.class "ew-modal-content"
                    , HA.class "ew-flex ew-absolute ew-inset-0"
                    , HA.classList [ ( "ew-pointer-events-none", toClosable props ) ]
                    , HA.style "overflow-y" "auto"
                    ]
                    [ H.div
                        [ HA.class "ew-relative ew-overflow-visible"
                        , HA.class "ew-m-auto ew-max-w-full ew-p-4"
                        , HA.style "width" (String.fromInt attrs.maxWidth ++ "px")
                        ]
                        [ H.div
                            (attrs.htmlAttributes
                                ++ [ HA.class "ew-relative ew-overflow-visible ew-pointer-events-auto"
                                   , HA.class "ew-w-full ew-bg-base-bg ew-shadow-lg ew-rounded-lg"
                                   ]
                            )
                            (toContent props)
                        ]
                    ]
                ]
    in
    case props of
        Stateless { id } ->
            H.div []
                [ H.node
                    "input"
                    [ HA.id id
                    , HA.type_ "checkbox"
                    , HA.class "ew-hidden ew-modal-toggle"
                    ]
                    []
                , wrapper
                ]

        _ ->
            wrapper
