module W.Popover exposing
    ( view
    , top, topRight, bottomRight, left, leftBottom, right, rightBottom
    , over, offset
    , id, class, full, htmlAttrs, Attribute, Position
    )

{-|

@docs view
@docs top, topRight, bottomRight, left, leftBottom, right, rightBottom
@docs over, offset
@docs id, class, full, htmlAttrs, Attribute, Position

-}

import Html as H
import Html.Attributes as HA
import W.Internal.Helpers as WH



-- Placement


{-| TODO: Unexpose this type.
-}
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
    { id : Maybe String
    , position : Position
    , offset : Float
    , full : Bool
    , over : Bool
    , unstyled : Bool
    , class : String
    , htmlAttributes : List (H.Attribute msg)
    }


applyAttrs : List (Attribute msg) -> Attributes msg
applyAttrs attrs =
    List.foldl (\(Attribute fn) a -> fn a) defaultAttrs attrs


defaultAttrs : Attributes msg
defaultAttrs =
    { id = Nothing
    , position = BottomLeft
    , offset = 0
    , full = False
    , over = False
    , unstyled = False
    , class = ""
    , htmlAttributes = []
    }



-- Attributes : Setters


{-| -}
id : String -> Attribute msg
id v =
    Attribute <| \attrs -> { attrs | id = Just v }


{-| -}
class : String -> Attribute msg
class v =
    Attribute <| \attrs -> { attrs | class = v }


{-| -}
full : Bool -> Attribute msg
full v =
    Attribute <| \attrs -> { attrs | full = v }


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
htmlAttrs : List (H.Attribute msg) -> Attribute msg
htmlAttrs v =
    Attribute <| \attrs -> { attrs | htmlAttributes = v }



-- Main


{-| -}
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

        positionClass : String
        positionClass =
            case attrs.position of
                TopLeft ->
                    "ew-m-top-left"

                TopRight ->
                    "ew-m-top-right"

                LeftTop ->
                    "ew-m-left-top"

                LeftBottom ->
                    "ew-m-left-bottom"

                RightTop ->
                    "ew-m-right-top"

                RightBottom ->
                    "ew-m-right-bottom"

                BottomLeft ->
                    "ew-m-bottom-left"

                BottomRight ->
                    "ew-m-bottom-right"
    in
    H.div
        [ HA.class "ew ew-popover" ]
        [ H.div [ HA.tabindex 0 ] props.children
        , H.div
            [ HA.class "ew ew-popover-content"
            , HA.class positionClass
            , HA.classList
                [ ( "ew-m-full", attrs.full )
                , ( "ew-m-over", attrs.over )
                , ( "ew-m-styled", not attrs.unstyled )
                ]
            , WH.styles [ ( "--offset", String.fromFloat attrs.offset ++ "px" ) ]
            ]
            [ H.div
                (attrs.htmlAttributes
                    ++ [ WH.maybeAttr HA.id attrs.id
                       , HA.class attrs.class
                       ]
                )
                props.content
            ]
        ]
