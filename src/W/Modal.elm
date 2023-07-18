module W.Modal exposing
    ( view
    , viewToggable, viewToggle
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

@docs viewToggable, viewToggle


# Styles

@docs absolute, maxWidth, noBlur, zIndex


# Html

@docs htmlAttrs, noAttr, Attribute

-}

import Html as H
import Html.Attributes as HA
import Html.Events as HE
import W.Internal.Icons



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
    = Stateless { id : String, content : List (H.Html msg) }
    | Stateful { isOpen : Bool, onClose : Maybe msg, content : List (H.Html msg) }


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
    view_ attrs (Stateless props)


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

        closeButtonAttrs : List (H.Attribute msg)
        closeButtonAttrs =
            [ HA.style "z-index" (String.fromInt attrs.zIndex)
            , HA.class "ew-block ew-top-2 ew-right-2"
            , HA.class "ew-bg-base-bg ew-text-base-aux ew-p-2.5 ew-rounded-md"
            , HA.class "ew-focusable ew-border-0"
            , HA.class "ew-opacity-50 hover:ew-opacity-100 focus-visible:ew-opacity-100"
            , HA.class "ew-shadow hover:ew-shadow-lg"
            , HA.class "ew-transition"
            , HA.classList
                [ ( "ew-absolute", attrs.absolute )
                , ( "ew-fixed", not attrs.absolute )
                ]
            ]

        closeButton : List (H.Html msg) -> H.Html msg
        closeButton children =
            case props of
                Stateless { id } ->
                    H.label (HA.for id :: closeButtonAttrs) children

                Stateful { onClose } ->
                    onClose
                        |> Maybe.map (\x -> H.button (HE.onClick x :: closeButtonAttrs) children)
                        |> Maybe.withDefault (H.text "")

        wrapper : H.Html msg
        wrapper =
            H.div
                []
                [ H.div
                    [ HA.attribute "role" "dialog"
                    , HA.style "z-index" (String.fromInt attrs.zIndex)
                    , HA.class "ew-modal ew-hidden ew-bg-black/30"
                    , HA.class "ew-flex ew-flex-col"
                    , HA.style "overflow-y" "auto"
                    , HA.style "overflow-x" "hidden"
                    , HA.class "ew-py-8 ew-px-8"
                    , if attrs.blur then
                        HA.style "backdrop-filter" "blur(1px)"

                      else
                        HA.class ""
                    , HA.classList
                        [ ( "ew-modal--is-open"
                          , case props of
                                Stateful { isOpen } ->
                                    isOpen

                                _ ->
                                    False
                          )
                        , ( "ew-absolute ew-inset-0", attrs.absolute )
                        , ( "ew-fixed ew-inset-0", not attrs.absolute )
                        ]
                    ]
                    [ H.div
                        (attrs.htmlAttributes
                            ++ [ HA.class "ew-modal-content ew-relative ew-opacity-0"
                               , HA.class "ew-overflow-visible"
                               , HA.class "ew-m-auto ew-max-w-full ew-shrink-0"
                               , HA.style "width" (String.fromInt attrs.maxWidth ++ "px")
                               , HA.class "ew-bg-base-bg ew-shadow-lg ew-rounded-lg"
                               ]
                        )
                        (case props of
                            Stateless { content } ->
                                content

                            Stateful { content } ->
                                content
                        )
                    ]
                , closeButton [ W.Internal.Icons.close { size = 10 } ]
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
