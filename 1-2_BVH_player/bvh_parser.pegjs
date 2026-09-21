

start
= h:hierarchy WS m:motion {
    return {
        "hierarchy": h,
        "motion": m,
    }
}

WS
= [ \t\r\n]+

INT
= n:$( "-"? [0-9]+ ) { return parseInt(n, 10); }

FLOAT
= n:$( "-"? [0-9]+ "." [0-9]* ( "e"i $( "-"? [0-9]+ ) )? ) { return parseFloat(n); }

NUMBER
= FLOAT / INT

NAME
= $( [a-z_]i [a-z0-9_]i* )

hierarchy
= "HIERARCHY" WS @root

root
= "ROOT" WS n:node {
    n.type = "root"
    return n
}

link
= joint / end


joint
= "JOINT" WS n:node {
    n.type = "joint"
    return n
}

node
= node_name:NAME WS 
    "{" WS 
        "OFFSET" WS joint_offset:NUMBER|3, WS| WS 
        "CHANNELS" WS num_channels:INT WS channels:NAME|{ return num_channels; }, WS| WS 
        links:link|1.., WS| WS 
    "}" 

    {
        return {
            "name": node_name,
            "offset": joint_offset,
            "num_channels": num_channels,
            "channels": channels,
            "conn_links": links,
        };
    }

end
= "End"i WS "Site"i WS 
    "{" WS 
        "OFFSET" WS joint_offset:NUMBER|3, WS| WS 
    "}" 

    {
        return {
            "type": "end",
            "offset": joint_offset,
        };
    }


motion
= "MOTION" WS $( [a-z_]i [a-z0-9_ :\t\r\n.-]i* )