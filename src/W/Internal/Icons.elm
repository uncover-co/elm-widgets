module W.Internal.Icons exposing (close)

import Svg as S
import Svg.Attributes as SA


close : { size : Float } -> S.Svg msg
close props =
    S.svg
        [ SA.width (String.fromFloat props.size ++ "px")
        , SA.height (String.fromFloat props.size ++ "px")
        , SA.viewBox "0 0 512 512"
        ]
        [ S.path
            [ SA.d "M289.94,256l95-95A24,24,0,0,0,351,127l-95,95-95-95A24,24,0,0,0,127,161l95,95-95,95A24,24,0,1,0,161,385l95-95,95,95A24,24,0,0,0,385,351Z"
            , SA.fill "currentColor"
            ]
            []
        ]
