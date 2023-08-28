module W.Docs.InputCode exposing (Model, init, docs)

import ElmBook.Chapter exposing (Chapter, chapter, renderStatefulComponentList)
import ElmBook.Actions exposing (updateState)
import Html as H
import Html.Attributes as HA
import W.InputCode


type alias Model
    = String


init : Model
init =
    ""


docs : Chapter { x | inputCode : Model }
docs =
    chapter "W.InputCode"
        |> renderStatefulComponentList
            [ ( "Default"
              , \{ inputCode } ->
                    W.InputCode.view []
                        { length = 6
                        , value = inputCode
                        , onInput =
                            \input ->
                                updateState (\state -> { state | inputCode = input })
                        }
              )
            , ( "Hidden Characters"
              , \{ inputCode } ->
                    W.InputCode.view [ W.InputCode.hiddenCharacters ]
                        { length = 6
                        , value = inputCode
                        , onInput =
                            \input ->
                                updateState (\state -> { state | inputCode = input })
                        }
              )
            , ( "Uppercase"
              , \{ inputCode } ->
                    W.InputCode.view [ W.InputCode.uppercase ]
                        { length = 6
                        , value = inputCode
                        , onInput =
                            \input ->
                                updateState (\state -> { state | inputCode = input })
                        }
              )
            ]
