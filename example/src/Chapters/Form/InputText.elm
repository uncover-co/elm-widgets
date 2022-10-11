module Chapters.Form.InputText exposing (chapter_)

import ElmBook.Actions exposing (logActionWithString)
import ElmBook.Chapter exposing (Chapter, chapter, renderComponentList)
import W.InputText


chapter_ : Chapter x
chapter_ =
    chapter "Input Text"
        |> renderComponentList
            [ ( "Default"
              , W.InputText.view
                    [ W.InputText.placeholder "Type something…"
                    ]
                    { value = ""
                    , onInput = logActionWithString "onInput"
                    }
              )
            , ( "Disabled"
              , W.InputText.view
                    [ W.InputText.placeholder "Type something…"
                    , W.InputText.disabled True
                    ]
                    { value = ""
                    , onInput = logActionWithString "onInput"
                    }
              )
            , ( "Read Only"
              , W.InputText.view
                    [ W.InputText.placeholder "Type something…"
                    , W.InputText.readOnly True
                    ]
                    { value = ""
                    , onInput = logActionWithString "onInput"
                    }
              )
            , ( "Password"
              , W.InputText.view
                    [ W.InputText.password
                    , W.InputText.placeholder "Type your password…"
                    ]
                    { value = ""
                    , onInput = logActionWithString "onInput"
                    }
              )
            , ( "Search"
              , W.InputText.view
                    [ W.InputText.search
                    , W.InputText.placeholder "Search…"
                    ]
                    { value = ""
                    , onInput = logActionWithString "onInput"
                    }
              )
            , ( "Email"
              , W.InputText.view
                    [ W.InputText.email
                    , W.InputText.placeholder "user@email.com"
                    ]
                    { value = ""
                    , onInput = logActionWithString "onInput"
                    }
              )
            , ( "Url"
              , W.InputText.view
                    [ W.InputText.url
                    , W.InputText.placeholder "https://app.site.com"
                    ]
                    { value = ""
                    , onInput = logActionWithString "onInput"
                    }
              )
            ]
