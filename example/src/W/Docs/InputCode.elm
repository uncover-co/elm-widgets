module W.Docs.InputCode exposing (Model, docs, init)

import ElmBook.Actions exposing (updateState)
import ElmBook.Chapter exposing (Chapter, chapter, renderStatefulComponentList)
import Html as H
import Html.Attributes as HA
import W.InputCode


type alias Model =
    String


init : Model
init =
    ""


docs : Chapter { x | inputCode : Model }
docs =
    chapter "Input Code"
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
