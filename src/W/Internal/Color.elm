module W.Internal.Color exposing
    ( fromHex
    , fromSolidColor
    , toHex
    , toSolidColor
    )

import Color
import SolidColor


toSolidColor : Color.Color -> SolidColor.SolidColor
toSolidColor color =
    color
        |> Color.toRgba
        |> (\{ red, green, blue } -> ( red * 255, green * 255, blue * 255 ))
        |> SolidColor.fromRGB


fromSolidColor : SolidColor.SolidColor -> Color.Color
fromSolidColor color =
    color
        |> SolidColor.toRGB
        |> (\( r, g, b ) -> Color.rgb255 (floor r) (floor g) (floor b))


fromHex : String -> Color.Color
fromHex hex =
    SolidColor.fromHex hex
        |> Result.map fromSolidColor
        |> Result.withDefault Color.black


toHex : Color.Color -> String
toHex color =
    color
        |> toSolidColor
        |> SolidColor.toHex
