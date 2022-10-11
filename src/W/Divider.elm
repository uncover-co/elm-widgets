module W.Divider exposing
    ( horizontal
    , vertical
    )

import Html as H
import Html.Attributes as HA


baseClasses : String
baseClasses =
    "ew-border-base-aux ew-border-0 ew-border-t-2 ew-opacity-20 ew-m-0"


horizontal : H.Html msg
horizontal =
    H.hr [ HA.class baseClasses, HA.class "ew-border-t-2" ] []


vertical : H.Html msg
vertical =
    H.hr [ HA.class baseClasses, HA.class "ew-border-l-2" ] []
