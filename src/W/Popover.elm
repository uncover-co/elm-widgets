module W.Popover exposing
    ( viewNext, viewControlled
    , showOnHover, persistent
    , top, topRight, bottomRight, left, leftBottom, right, rightBottom
    , over, offset, full, width, minWidth
    , htmlAttrs, noAttr, Attribute
    , view
    )

{-|

@docs viewNext, viewControlled


# Behavior

@docs showOnHover, persistent


# Position

@docs top, topRight, bottomRight, left, leftBottom, right, rightBottom


# Styles

@docs over, offset, full, width, minWidth


# Html

@docs htmlAttrs, noAttr, Attribute


# Deprecated

@docs view

-}

import Html as H
import Html.Attributes as HA
import Theme



-- Placement


{-| -}
type Position
    = TopLeft
    | TopRight
    | LeftTop
    | LeftBottom
    | RightTop
    | RightBottom
    | BottomLeft
    | BottomRight



-- Attributes


{-| -}
type Attribute msg
    = Attribute (Attributes msg -> Attributes msg)


type alias Attributes msg =
    { position : Position
    , offset : Float
    , full : Bool
    , over : Bool
    , persistent : Bool
    , isOpen : Maybe Bool
    , widthAttr : ( String, String )
    , showOnHover : Bool
    , unstyled : Bool
    , htmlAttributes : List (H.Attribute msg)
    }


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes msg
defaultAttrs =
    { position = BottomLeft
    , offset = 0
    , full = False
    , over = False
    , persistent = False
    , isOpen = Nothing
    , widthAttr = ( "width", "auto" )
    , showOnHover = False
    , unstyled = False
    , htmlAttributes = []
    }



-- Attributes : Setters


{-| -}
offset : Float -> Attribute msg
offset v =
    Attribute <| \attrs -> { attrs | offset = v }


{-| -}
bottomRight : Attribute msg
bottomRight =
    Attribute <| \attrs -> { attrs | position = BottomRight }


{-| -}
top : Attribute msg
top =
    Attribute <| \attrs -> { attrs | position = TopLeft }


{-| -}
topRight : Attribute msg
topRight =
    Attribute <| \attrs -> { attrs | position = TopRight }


{-| -}
left : Attribute msg
left =
    Attribute <| \attrs -> { attrs | position = LeftTop }


{-| -}
leftBottom : Attribute msg
leftBottom =
    Attribute <| \attrs -> { attrs | position = LeftBottom }


{-| -}
right : Attribute msg
right =
    Attribute <| \attrs -> { attrs | position = RightTop }


{-| -}
rightBottom : Attribute msg
rightBottom =
    Attribute <| \attrs -> { attrs | position = RightBottom }


{-| -}
over : Attribute msg
over =
    Attribute <| \attrs -> { attrs | over = True }


{-| -}
persistent : Attribute msg
persistent =
    Attribute <| \attrs -> { attrs | persistent = True }


isOpen : Bool -> Attribute msg
isOpen v =
    Attribute <| \attrs -> { attrs | isOpen = Just v }


{-| -}
full : Bool -> Attribute msg
full v =
    Attribute <| \attrs -> { attrs | full = v }


{-| -}
width : Int -> Attribute msg
width v =
    Attribute <| \attrs -> { attrs | widthAttr = ( "width", String.fromInt v ++ "px" ) }


{-| -}
minWidth : Int -> Attribute msg
minWidth v =
    Attribute <| \attrs -> { attrs | widthAttr = ( "min-width", String.fromInt v ++ "px" ) }


{-| -}
showOnHover : Attribute msg
showOnHover =
    Attribute <| \attrs -> { attrs | showOnHover = True }


{-| -}
htmlAttrs : List (H.Attribute msg) -> Attribute msg
htmlAttrs v =
    Attribute <| \attrs -> { attrs | htmlAttributes = v }


{-| -}
noAttr : Attribute msg
noAttr =
    Attribute identity



-- Main


{-| -}
viewNext :
    List (Attribute msg)
    ->
        { content : List (H.Html msg)
        , trigger : List (H.Html msg)
        }
    -> H.Html msg
viewNext attrs props =
    view attrs
        { content = props.content
        , children = props.trigger
        }


{-| -}
viewControlled :
    List (Attribute msg)
    ->
        { isOpen : Bool
        , content : List (H.Html msg)
        , trigger : List (H.Html msg)
        }
    -> H.Html msg
viewControlled attrs props =
    view (isOpen props.isOpen :: attrs)
        { content = props.content
        , children = props.trigger
        }



{- TODO: Rename `viewNext` to `view` and remove the old implementation. -}


{-| @deprecated

The naming used here can be quite confusing so we renamed them under `viewNext`, it is supposed to become the default naming on the next major release.

-}
view :
    List (Attribute msg)
    ->
        { content : List (H.Html msg)
        , children : List (H.Html msg)
        }
    -> H.Html msg
view attrs_ props =
    let
        attrs : Attributes msg
        attrs =
            applyAttrs attrs_

        offsetPx : String
        offsetPx =
            if attrs.over then
                "0"

            else
                String.fromFloat attrs.offset ++ "px"

        offsetValue : String
        offsetValue =
            "100%"

        offsetIfOver : String
        offsetIfOver =
            if attrs.over then
                "0"

            else
                offsetValue

        crossAnchor : String -> H.Attribute msg
        crossAnchor x =
            if attrs.full then
                HA.style x "0"

            else
                HA.style x "auto"

        positionAttrs : List (H.Attribute msg)
        positionAttrs =
            case attrs.position of
                TopLeft ->
                    [ HA.style "left" "0"
                    , HA.style "bottom" offsetIfOver
                    , HA.style "padding-bottom" offsetPx
                    , crossAnchor "right"
                    ]

                TopRight ->
                    [ HA.style "right" "0"
                    , HA.style "bottom" offsetIfOver
                    , HA.style "padding-bottom" offsetPx
                    , crossAnchor "left"
                    ]

                BottomLeft ->
                    [ HA.style "left" "0"
                    , HA.style "top" offsetIfOver
                    , HA.style "padding-top" offsetPx
                    , crossAnchor "right"
                    ]

                BottomRight ->
                    [ HA.style "right" "0"
                    , HA.style "top" offsetIfOver
                    , HA.style "padding-top" offsetPx
                    , crossAnchor "left"
                    ]

                LeftTop ->
                    [ HA.style "right" offsetValue
                    , HA.style "top" "0"
                    , HA.style "padding-right" offsetPx
                    ]

                LeftBottom ->
                    [ HA.style "right" offsetValue
                    , HA.style "bottom" "0"
                    , HA.style "padding-right" offsetPx
                    ]

                RightTop ->
                    [ HA.style "left" offsetValue
                    , HA.style "top" "0"
                    , HA.style "padding-left" offsetPx
                    ]

                RightBottom ->
                    [ HA.style "left" offsetValue
                    , HA.style "bottom" "0"
                    , HA.style "padding-left" offsetPx
                    ]
    in
    H.div
        [ HA.class "ew-popover ew-inline-flex ew-relative"
        , case attrs.isOpen of
            Just isOpen_ ->
                HA.classList
                    [ ( "ew-is-open", isOpen_ )
                    , ( "ew-is-closed", not isOpen_ )
                    ]

            Nothing ->
                HA.classList
                    [ ( "ew-show-on-hover", attrs.showOnHover )
                    , ( "ew-persistent", attrs.persistent )
                    ]
        ]
        [ H.div [ HA.class "ew-popover-trigger ew-w-full" ] props.children
        , H.div
            (positionAttrs
                ++ [ HA.class "ew-popover-content ew-absolute ew-z-[9999] shrink-0"
                   , HA.classList [ ( "ew-min-w-full", attrs.over ) ]
                   ]
            )
            [ H.div
                (attrs.htmlAttributes
                    ++ [ HA.class "ew-overflow-visible"
                       , Theme.styles [ attrs.widthAttr ]
                       , HA.classList
                            [ ( "ew-bg-base-bg ew-rounded-sm ew-border-solid ew-border ew-border-base-aux/20 ew-shadow-lg", not attrs.unstyled )
                            ]
                       ]
                )
                props.content
            ]
        ]
