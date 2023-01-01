module W.Internal.Helpers exposing
    ( attrIf
    , formatFloat
    , keepIf
    , limitString
    , maybeAttr
    , maybeHtml
    , nearestFloats
    , nearestInts
    , onEnter
    , stringIf
    , styles
    )

import Html as H
import Html.Attributes as HA
import Html.Events as HE
import Json.Decode as D



-- Styles


styles : List ( String, String ) -> H.Attribute msg
styles xs =
    xs
        |> List.map (\( k, v ) -> k ++ ":" ++ v)
        |> String.join ";"
        |> HA.attribute "style"



-- Html.Attributes


attrIf : Bool -> (a -> H.Attribute msg) -> a -> H.Attribute msg
attrIf b fn a =
    if b then
        fn a

    else
        HA.class ""


maybeAttr : (a -> H.Attribute msg) -> Maybe a -> H.Attribute msg
maybeAttr fn a =
    a
        |> Maybe.map fn
        |> Maybe.withDefault (HA.class "")



-- Html


maybeHtml : (a -> H.Html msg) -> Maybe a -> H.Html msg
maybeHtml fn a =
    a
        |> Maybe.map fn
        |> Maybe.withDefault (H.text "")



-- Html.Events


enterDecoder : a -> D.Decoder a
enterDecoder a =
    D.field "key" D.string
        |> D.andThen
            (\key ->
                if key == "Enter" then
                    D.succeed a

                else
                    D.fail "Invalid key."
            )


onEnter : msg -> H.Attribute msg
onEnter msg =
    HE.on "keyup" (enterDecoder msg)



-- Basics


keepIf : Bool -> Maybe a -> Maybe a
keepIf a m =
    if a then
        m

    else
        Nothing


stringIf : Bool -> String -> String -> String
stringIf v a b =
    if v then
        a

    else
        b


limitString : Maybe Int -> String -> String
limitString limit str =
    limit
        |> Maybe.map (\l -> String.left l str)
        |> Maybe.withDefault str


nearestFloats : Float -> Float -> ( Float, Float )
nearestFloats v step =
    let
        lower : Float
        lower =
            toFloat (floor (v / step)) * step
    in
    ( lower, lower + step )


nearestInts : Int -> Int -> ( Int, Int )
nearestInts v step =
    let
        lower : Int
        lower =
            (v // step) * step
    in
    ( lower, lower + step )


formatFloat : Float -> Float -> String
formatFloat step value =
    value
        |> String.fromFloat
        |> String.split "."
        |> (\parts ->
                case parts of
                    [ h, t ] ->
                        let
                            decimals : Int
                            decimals =
                                step
                                    |> String.fromFloat
                                    |> String.split "."
                                    |> List.drop 1
                                    |> List.head
                                    |> Maybe.map String.length
                                    |> Maybe.withDefault 0
                        in
                        h
                            ++ "."
                            ++ String.left decimals t

                    [ h ] ->
                        h

                    _ ->
                        ""
           )
